using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class GetEntreprisesByPaymentHandler : IRequestHandler<GetEntreprisesByPaymentQuery, PaymentViewModel>
    {
        public Context _context;
        private readonly IMediator _mediator;

        public GetEntreprisesByPaymentHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public int DeterminePaiementType(Entreprise entreprise, long FiscalYear)
        {
            // Unpaid
            if(entreprise.Statut_paiement == 0)
            {
                return 0;
            // Partially Paid
            } else if(entreprise.Statut_paiement == 1)
            {
                return 1;
            } else if(entreprise.Statut_paiement == 2) {
            // Payed
                return 2;
            } else {
                return 3;
            }
        }
        public async Task<PaymentViewModel> Handle(GetEntreprisesByPaymentQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> filtered = new List<Entreprise>();

            List<Entreprise> allEntreprises = _context.entreprises
                .Include(ent => ent.Publicites)
                .Where(ent => ent.Desactive == false)
                .ToList();

            foreach (var ent in allEntreprises)
            {
                foreach (var pub in ent.Publicites)
                {
                    pub.Taxe_totale = pub.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(pub.Exercice_courant, pub.Type_publicite, pub.Quantite, pub.Face, pub.Surface));
                }
            }

            if (request.Filters.Type == "unpaid")
            {
                var entreprises = allEntreprises
               .Where(ent => ent.Statut_paiement == 0)
               .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0 || e.Pourcentage_majoration > 0)
               .ToList();
                filtered.AddRange(entreprises);
            } else if (request.Filters.Type == "partially_paid")
            {
                var entreprises = allEntreprises
                .Where(ent => ent.Statut_paiement == 1)
                .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0 || e.Pourcentage_majoration > 0)
               .ToList();
                filtered.AddRange(entreprises);
            } else if (request.Filters.Type == "payed")
            {
                var entreprises = allEntreprises
               .Where(ent => ent.Statut_paiement == 2)
               .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0 || e.Pourcentage_majoration > 0)
               .ToList();
                filtered.AddRange(entreprises);
            } else if (request.Filters.Type == "all")
            {
                filtered.AddRange(allEntreprises.Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0 || e.Pourcentage_majoration > 0));
            }

            if (request.Filters.Matricule != null)
            {
                filtered = filtered.Where(e => e.Matricule_ciger == request.Filters.Matricule).ToList();
            }

            var totalOfPaymentsTypes = allEntreprises
                .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0 || e.Pourcentage_majoration > 0)
                .GroupBy(p => p.Statut_paiement).Select(p => new
                {
                    Type = p.Key,
                    Total = p.Count()
                })
                .ToList();

            int TotalNonPayes()
            {
                var sum = totalOfPaymentsTypes.FirstOrDefault(t => t.Type == 0);
                if (sum != null)
                {
                    return sum.Total;
                }
                return 0;
            }

            int TotalPartiellentPayes()
            {
                var sum = totalOfPaymentsTypes.FirstOrDefault(t => t.Type == 1);
                if(sum != null)
                {
                    return sum.Total;
                }
                return 0;
            }

            int TotalPayes()
            {
                var sum = totalOfPaymentsTypes.FirstOrDefault(t => t.Type == 2);
                if (sum != null)
                {
                    return sum.Total;
                }
                return 0;
            }

            int TotalAValider = allEntreprises
                .Where(ent => ent.Publicites.Sum(p => p.Taxe_totale) == 0)
                .Where(ent => ent.Pourcentage_majoration == 0)
                .Where(ent => ent.Statut_paiement == 0)
                .Count();

            int TotalElements = filtered.Count();
            int TotalPages = (int)Math.Ceiling(TotalElements / (double)request.Filters.ElementsParPage);
            if (request.Filters.PageCourante > TotalPages)
            {
                request.Filters.PageCourante = TotalPages;
            }
            int Index = (request.Filters.PageCourante - 1) * request.Filters.ElementsParPage;
            filtered = filtered.Skip(Index).Take(request.Filters.ElementsParPage).ToList();

            int MajorationIfTaxIsNull(int pourcentage) {
                if(pourcentage == 10) {
                    return 5;
                } else if(pourcentage == 50) {
                    return 10;
                } else if(pourcentage == 100) {
                    return 20;
                } else if(pourcentage == 200) {
                    return 40;
                } else {
                    return 5;
                }
            }


            return new PaymentViewModel
            {
                Paiements = filtered.Select(ent => new PaiementInfos
                {
                    Id_entreprise = ent.Id_entreprise,
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Nombre_panneaux = ent.Publicites.Count(),
                    Statut_paiement = DeterminePaiementType(ent, request.Filters.Exercice),
                    Taxe_totale = (ent.Publicites.Sum(ent => ent.Taxe_totale) > 0 || ent.Pourcentage_majoration == 0) ? (ent.Publicites.Sum(p => p.Taxe_totale) + ent.Publicites.Sum(p => p.Taxe_totale) * ent.Pourcentage_majoration / 100) : MajorationIfTaxIsNull(ent.Pourcentage_majoration)
                }).ToList(),
                TotalPages = TotalPages,
                PageCourante = request.Filters.PageCourante,
                ElementsParPage = request.Filters.ElementsParPage,
                Total_non_payes = TotalNonPayes(),
                Total_partiellement_payes = TotalPartiellentPayes(),
                Total_payes = TotalPayes(),
                Total_a_valider = TotalAValider
            };
        }
    }
}
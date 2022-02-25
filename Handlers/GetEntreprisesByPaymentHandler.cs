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
                .ToList();

            foreach(var ent in allEntreprises)
            {
                foreach(var pub in ent.Publicites)
                {
                    pub.Taxe_totale = pub.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(pub.Exercice_courant, pub.Type_publicite, pub.Quantite, pub.Face, pub.Surface));
                }
            }

            if (request.Filters.Type == "unpaid")
            {
               var entreprises = allEntreprises
              .Where(ent => ent.Statut_paiement == 0)
              .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0)
              .ToList();
               filtered.AddRange(entreprises);
            } else if (request.Filters.Type == "partially_paid")
            {
                var entreprises = allEntreprises
                .Where(ent => ent.Statut_paiement == 1)
                .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0)
               .ToList();
                filtered.AddRange(entreprises);
            } else if(request.Filters.Type == "payed")
            {
                var entreprises = allEntreprises
               .Where(ent => ent.Statut_paiement == 2)
               .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0)
               .ToList();
                filtered.AddRange(entreprises);
            } else if(request.Filters.Type == "all")
            {
                filtered.AddRange(allEntreprises.Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0));
            }

            var totalOfPaymentsTypes = allEntreprises
                .Where(e => e.Publicites.Sum(p => p.Taxe_totale) > 0)
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


            return new PaymentViewModel
            {
                Paiements = filtered.Select(ent => new PaiementInfos
                {
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Nombre_panneaux = ent.Publicites.Count(),
                    Statut_paiement = DeterminePaiementType(ent, request.Filters.Exercice),
                    Taxe_totale = (ent.Publicites.Sum(p => p.Taxe_totale) + ent.Publicites.Sum(p => p.Taxe_totale) * ent.Pourcentage_majoration / 100)
                }).ToList(),
                TotalPages = 1,
                PageCourante = 1,
                ElementsParPage = 15,
                Total_non_payes = TotalNonPayes(),
                Total_partiellement_payes = TotalPartiellentPayes(),
                Total_payes = TotalPayes()
            };
        }
    }
}
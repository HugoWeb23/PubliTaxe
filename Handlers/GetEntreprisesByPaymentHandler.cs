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
            int numberOfPayments = _context.paiements_recus.Where(p => p.Matricule_ciger == entreprise.Matricule_ciger && p.ExerciceId == FiscalYear).Count();
            // Unpaid
            if(numberOfPayments == 0)
            {
                return 1;
            // Partially Paid
            } else if(numberOfPayments > 0)
            {
                return 2;
            } else
            {
                return 0;
            }
        }
        public async Task<PaymentViewModel> Handle(GetEntreprisesByPaymentQuery request, CancellationToken cancellationToken)
        {
           List<Entreprise> filtered = new List<Entreprise>();

            var total = _context.paiements_recus.Where(p => p.ExerciceId == request.Fiscalyear).GroupBy(p => p.Matricule_ciger).Select(p => new
            {
                p.Key,
                Total = p.Sum(g => g.Montant)
            })
            .ToList();

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

            if (request.Type == "unpaid")
            {
                var entreprises = allEntreprises
              .Where(ent => total.Where(t => t.Key == ent.Matricule_ciger).Select(t => t.Total).FirstOrDefault() == 0)
              .ToList();
                filtered.AddRange(entreprises);
            } else if (request.Type == "partially_paid")
            {
                var entreprises = allEntreprises
                .Where(ent => total.Where(t => t.Key == ent.Matricule_ciger).Select(t => t.Total).FirstOrDefault() > 0)
               .Where(ent => (ent.Publicites.Sum(p => p.Taxe_totale)) > (total.Where(t => t.Key == ent.Matricule_ciger).Select(t => t.Total).FirstOrDefault()))
               .ToList();
                filtered.AddRange(entreprises);
            } else if(request.Type == "payed")
            {
                var entreprises = allEntreprises
               .Where(ent => (ent.Publicites.Sum(p => p.Taxe_totale)) <= (total.Where(t => t.Key == ent.Matricule_ciger).Select(t => t.Total).FirstOrDefault()))
               .ToList();
                filtered.AddRange(entreprises);
            }


            return new PaymentViewModel
            {
                Paiements = filtered.Select(ent => new PaiementInfos
                {
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Nombre_panneaux = ent.Publicites.Count(),
                    Statut_paiement = DeterminePaiementType(ent, request.Fiscalyear)
                }).ToList(),
                TotalPages = 1,
                PageCourante = 1,
                ElementsParPage = 15
            };
        }
    }
}
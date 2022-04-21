using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.ViewModels;
using System;

namespace Taxes.Handlers
{
    public class GetPaymentDetailHandler : IRequestHandler<GetPaymentDetailQuery, PaymentDetailViewModel>
    {
        public Context _context;
        public IMediator _mediator;

        public GetPaymentDetailHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<PaymentDetailViewModel> Handle(GetPaymentDetailQuery request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises
                .Include(ent => ent.Code_postal)
                .ThenInclude(cp => cp.Pays)
                .Include(ent => ent.Publicites)
                .OrderBy(ent => ent.Matricule_ciger)
                .FirstOrDefault(e => e.Id_entreprise == request.ID);

            if (entreprise == null)
            {
                throw new Exception("L'entreprise n'existe pas");
            }

            foreach (var ent in entreprise.Publicites)
            {
                ent.Taxe_totale = ent.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface));
                ent.Surface_totale = ent.Quantite * ent.Surface;
            }

            decimal Taxe = entreprise.Publicites.Sum(p => p.Taxe_totale);
            decimal Montant_majoration = (entreprise.Publicites.Sum(p => p.Taxe_totale) * entreprise.Pourcentage_majoration / 100);

            Information information = _context.informations.OrderBy(i => i.Id).FirstOrDefault();

            if(information == null)
            {
                throw new Exception("Impossible de récupérer l'exercice courant");
            }

            List<Paiement> paiements = _context.paiements_recus
                .Where(p => p.Id_entreprise == request.ID && p.ExerciceId == information.Exercice_courant)
                .ToList();

            return new PaymentDetailViewModel
            {
                Taxe = Taxe,
                Montant_majoration = Montant_majoration,
                Taxe_totale = (Taxe + Montant_majoration),
                Entreprise = entreprise,
                Paiements = paiements
            };
        }
    }
}

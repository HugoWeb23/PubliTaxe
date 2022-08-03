using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Handlers
{
    public class InsertPaymentHandler : IRequestHandler<InsertPaymentCommand, Paiement>
    {
        private Context _context;
        private IMediator _mediator;
        public InsertPaymentHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<Paiement> Handle(InsertPaymentCommand request, CancellationToken cancellationToken)
        {
            Entreprise Entreprise = await _mediator.Send(new GetEntrepriseById(request.Payment.Id_entreprise));
            decimal SumTax = Entreprise.Publicites.Sum(p => p.Taxe_totale);

            if(Entreprise.Statut_paiement == 2)
            {
                throw new Exception("L'entreprise est déjà en ordre de paiement");
            }

            Information information = _context.informations.OrderBy(i => i.Id).FirstOrDefault();

            if (information == null)
            {
                throw new Exception("Impossible de récupérer l'exercice courant");
            }

            var AlreadyPayed = _context.paiements_recus
                .Where(p => p.Id_entreprise == request.Payment.Id_entreprise)
                .Where(p => p.ExerciceId == information.Exercice_courant)
                .Sum(p => p.Montant);

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

            decimal Montant_majoration = (Entreprise.Publicites.Sum(ent => ent.Taxe_totale) > 0 || Entreprise.Pourcentage_majoration == 0) ? (SumTax * Entreprise.Pourcentage_majoration / 100) : MajorationIfTaxIsNull(Entreprise.Pourcentage_majoration);
            decimal LeftToPay = (SumTax + Montant_majoration) - AlreadyPayed;

            request.Payment.ExerciceId = information.Exercice_courant;

            if(request.Payment.Montant >= LeftToPay)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = request.Payment.Id_entreprise,
                    Statut_paiement = 2
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            } else if(request.Payment.Montant < LeftToPay && Entreprise.Statut_paiement != 1)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = request.Payment.Id_entreprise,
                    Statut_paiement = 1
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            }
            _context.paiements_recus.Add(request.Payment);
            _context.SaveChanges();
            return request.Payment;
        }
    }
}

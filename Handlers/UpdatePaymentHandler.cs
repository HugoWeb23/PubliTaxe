using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Commands;
using System;

namespace Taxes.Handlers
{
    public class UpdatePaymentHandler : IRequestHandler<UpdatePaymentCommand, Paiement>
    {
        public Context _context;
        public IMediator _mediator;

        public UpdatePaymentHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<Paiement> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
        {
            Paiement CheckPayment = _context.paiements_recus
                .AsNoTracking()
                .Where(p => p.Id_paiement == request.Payment.Id_paiement)
                .FirstOrDefault();

            if (CheckPayment == null)
            {
                throw new Exception("Le paiement n'existe pas");
            }

            Information information = _context.informations.OrderBy(i => i.Id).FirstOrDefault();

            if (information == null)
            {
                throw new Exception("Impossible de récupérer l'exercice courant");
            }

            request.Payment.ExerciceId = information.Exercice_courant;

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

            Entreprise Entreprise = await _mediator.Send(new GetEntrepriseById(request.Payment.Id_entreprise));
            decimal SumTax = Entreprise.Publicites.Sum(p => p.Taxe_totale);
            decimal Montant_majoration = (Entreprise.Publicites.Sum(ent => ent.Taxe_totale) > 0 || Entreprise.Pourcentage_majoration == 0) ? (SumTax * Entreprise.Pourcentage_majoration / 100) : MajorationIfTaxIsNull(Entreprise.Pourcentage_majoration);
            decimal TotalTax = SumTax + Montant_majoration;
            decimal AlreadyPayed = _context.paiements_recus
                .Where(p => p.Id_entreprise == request.Payment.Id_entreprise)
                .Where(p => p.ExerciceId == information.Exercice_courant)
                .Sum(p => p.Montant);
            string UpOrDown = "";

            if (request.Payment.Montant < CheckPayment.Montant)
            {
                UpOrDown = "Down";
            } else if (request.Payment.Montant > CheckPayment.Montant)
            {
                UpOrDown = "Up";
            }


            if (UpOrDown == "Down" && (AlreadyPayed - request.Payment.Montant) < TotalTax)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = request.Payment.Id_entreprise,
                    Statut_paiement = 1
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            } else if(UpOrDown == "Up" && (AlreadyPayed - CheckPayment.Montant + request.Payment.Montant) >= TotalTax)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = request.Payment.Id_entreprise,
                    Statut_paiement = 2
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            }
            _context.paiements_recus.Update(request.Payment);
            _context.SaveChanges();

            return request.Payment;
        }

    }
}

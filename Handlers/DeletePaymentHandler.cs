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
using Taxes.Services;

namespace Taxes.Handlers
{
    public class DeletePaymentHandler : IRequestHandler<DeletePaymentCommand, bool>
    {
        public Context _context;
        public IMediator _mediator;

        public DeletePaymentHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<bool> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
        {
            Paiement CheckPayment = _context.paiements_recus
                .AsNoTracking()
                .Where(p => p.Id_paiement == request.PaymentId)
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

            Entreprise Entreprise = await _mediator.Send(new GetEntrepriseById(CheckPayment.Id_entreprise));

            if (Entreprise.Recu == false && Entreprise.Proces_verbal == false)
            {
                throw new Exception("L'entreprise n'a pas encore remis sa déclaration");
            }

            decimal SumTax = Entreprise.Publicites.Sum(p => p.Taxe_totale);
            decimal Montant_majoration = (Entreprise.Publicites.Sum(ent => ent.Taxe_totale) > 0 || Entreprise.Pourcentage_majoration == 0) ? (SumTax * Entreprise.Pourcentage_majoration / 100) : MajorationIfTaxIsNull.Calculate(Entreprise.Pourcentage_majoration);
            decimal TotalTax = SumTax + Montant_majoration;
            decimal AlreadyPayed = _context.paiements_recus
                .Where(p => p.Id_entreprise == CheckPayment.Id_entreprise)
                .Where(p => p.ExerciceId == information.Exercice_courant)
                .Sum(p => p.Montant);

            if((AlreadyPayed - CheckPayment.Montant) > 0 && (AlreadyPayed - CheckPayment.Montant) < TotalTax)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = CheckPayment.Id_entreprise,
                    Statut_paiement = 1
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            } else if((AlreadyPayed - CheckPayment.Montant) <= 0)
            {
                Entreprise ent = new Entreprise
                {
                    Id_entreprise = CheckPayment.Id_entreprise,
                    Statut_paiement = 0
                };
                _context.entreprises.Attach(ent);
                _context.Entry(ent).Property(ent => ent.Statut_paiement).IsModified = true;
            }

            _context.paiements_recus.Remove(CheckPayment);
            _context.SaveChanges();

            return true;
        }

    }
}

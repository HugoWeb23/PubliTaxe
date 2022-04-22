using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using System.Collections.Generic;
using Taxes.Queries;
using System.Linq;
using System;

namespace Taxes.Handlers
{
    public class ChangeFiscalYearHandler : IRequestHandler<ChangeFiscalYearCommand, Exercice>
    {
        private Context _context;
        private IMediator _mediator;
        public ChangeFiscalYearHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<Exercice> Handle(ChangeFiscalYearCommand request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises.ToList();
            List<Publicite> pubs = await _mediator.Send(new GetAllAdvertisingByFiscalYearQuery());
            Exercice Fiscalyear = await _mediator.Send(new GetFiscalYearByIdQuery(request.FiscalYearId), cancellationToken);
            List<Tarif> prices = await _mediator.Send(new GetAllPricesQuery());
            Information Informations = await _mediator.Send(new GetInformationsQuery());

            if (Fiscalyear == null)
            {
                throw new Exception("L'exercice n'existe pas");
            }

            if (prices.Where(p => p.ExerciceId == request.FiscalYearId).FirstOrDefault() == null)
            {
                throw new Exception("Aucun tarif n'est lié à cet exercice");
            }

            entreprises.ForEach(e =>
            {
                e.Proces_verbal = false;
                e.Recu = false;
                e.Statut_paiement = 0;
                e.Pourcentage_majoration = 0;
                e.Motif_majorationId = null;
            });

            pubs.ForEach(pub =>
            {
                pub.Exercice_courant = request.FiscalYearId;
            });

            Informations.Exercice_courant = request.FiscalYearId;

            _context.entreprises.UpdateRange(entreprises);
            _context.enseignes_publicitaires.UpdateRange(pubs);
            _context.informations.Update(Informations);
            _context.SaveChanges();
            return Fiscalyear;
        }
    }
}
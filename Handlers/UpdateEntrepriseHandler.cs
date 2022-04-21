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
    public class UpdateEntrepriseHandler : IRequestHandler<UpdateEntrepriseCommand, Entreprise>
    {
        private Context _context;
        private IMediator _mediator;
        public UpdateEntrepriseHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<Entreprise> Handle(UpdateEntrepriseCommand request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises.AsNoTracking().FirstOrDefault(ent => ent.Id_entreprise == request.Entreprise.Id_entreprise);
            if (entreprise == null) throw new Exception("L'entreprise n'existe pas");
            if (request.Entreprise.Matricule_ciger != entreprise.Matricule_ciger)
            {
                if (_context.entreprises.Any(ent => ent.Matricule_ciger == request.Entreprise.Matricule_ciger)) throw new Exception("Une entreprise possède déjà ce matricule");
            }
            // Enregistrement d'un non reçu pour la taxation d'office
            if(request.Entreprise.Pourcentage_majoration > 0)
            {
                var ExerciceId = await _mediator.Send(new GetInformationsQuery());
                NotReceived NotReceived = new NotReceived
                {
                    Id_entreprise = request.Entreprise.Id_entreprise,
                    Pourcentage_majoration = request.Entreprise.Pourcentage_majoration,
                    Motif_majorationId = (int)(request.Entreprise.Motif_majorationId != null ? request.Entreprise.Motif_majorationId : 1),
                    ExerciceId = (long)ExerciceId.GetType().GetProperty("Exercice_courant").GetValue(ExerciceId, null),
                    Remarque = ""
                };

                await _mediator.Send(new InsertNotReceivedCommand(NotReceived, false));
            }

            IEnumerable<Publicite> pubs = await _mediator.Send(new GetAdvertisingListByMatriculeQuery(request.Entreprise.Id_entreprise));
            IEnumerable<Publicite> test = pubs.Except(request.Entreprise.Publicites).ToList();
            _context.enseignes_publicitaires.RemoveRange(test);
            _context.entreprises.Update(request.Entreprise);
            _context.SaveChanges();
            return request.Entreprise;
        }
    }
}

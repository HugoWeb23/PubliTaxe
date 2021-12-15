using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using System.Collections.Generic;
using Taxes.Queries;
using System.Linq;

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
            // Enregistrement d'un non reçu pour la taxation d'office
            if(request.Entreprise.Pourcentage_majoration > 0)
            {
                var ExerciceId = await _mediator.Send(new GetInformationsQuery());
                NotReceived NotReceived = new NotReceived
                {
                    Matricule_ciger = request.Entreprise.Matricule_ciger,
                    Pourcentage_majoration = request.Entreprise.Pourcentage_majoration,
                    Motif_majorationId = (int)(request.Entreprise.Motif_majorationId != null ? request.Entreprise.Motif_majorationId : 1),
                    ExerciceId = (long)ExerciceId.GetType().GetProperty("Exercice_courant").GetValue(ExerciceId, null),
                    Remarque = ""
                };

                await _mediator.Send(new InsertNotReceivedCommand(NotReceived, false));
            }

            IEnumerable<Publicite> pubs = await _mediator.Send(new GetAdvertisingListByMatriculeQuery(request.Entreprise.Matricule_ciger));
            IEnumerable<Publicite> test = pubs.Except(request.Entreprise.Publicites).ToList();
            _context.enseignes_publicitaires.RemoveRange(test);
            _context.entreprises.Update(request.Entreprise);
            _context.SaveChanges();
            return request.Entreprise;
        }
    }
}

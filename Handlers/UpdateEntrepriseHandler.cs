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
            if (entreprise.Statut_paiement == 2) throw new Exception("L'entreprise est en ordre de paiement");

            if (request.Entreprise.Matricule_ciger != entreprise.Matricule_ciger)
            {
                if (_context.entreprises.AsNoTracking().Any(ent => ent.Matricule_ciger == request.Entreprise.Matricule_ciger)) throw new Exception("Une entreprise possède déjà ce matricule");
            }
            if (request.Entreprise.Proces_verbal && request.Entreprise.Pourcentage_majoration == 0)
            {
                throw new Exception("Vous devez sélectionner un poucentage de majoration pour activer le procès-verbal");
            }
            if (request.Entreprise.Pourcentage_majoration > 0 && request.Entreprise.Proces_verbal == false)
            {
                throw new Exception("Vous devez cocher la case procès-verbal pour appliquer un pourcentage de majoration");
            }
            var Informations = await _mediator.Send(new GetInformationsQuery());
            long ExerciceId = (long)Informations.GetType().GetProperty("Exercice_courant").GetValue(Informations, null);
            NotReceived NonRecu = _context.non_recus.AsNoTracking().Where(n => n.ExerciceId == ExerciceId && n.Id_entreprise == entreprise.Id_entreprise).OrderBy(n => n.Id).FirstOrDefault();
            // Suppression de l'infraction de l'exercice actuel si procès-verbal n'est pas coché
            if (NonRecu != null && request.Entreprise.Proces_verbal == false)
            {
                await _mediator.Send(new DeleteNotReceivedCommand(NonRecu.Id, false));
            }
            // Enregistrement d'un non reçu pour la taxation d'office
            if(request.Entreprise.Pourcentage_majoration > 0 && request.Entreprise.Proces_verbal)
            {
               
                NotReceived NotReceived = new NotReceived
                {
                    Id_entreprise = request.Entreprise.Id_entreprise,
                    Pourcentage_majoration = request.Entreprise.Pourcentage_majoration,
                    Motif_majorationId = (int)(request.Entreprise.Motif_majorationId != null ? request.Entreprise.Motif_majorationId : 1),
                    ExerciceId = ExerciceId,
                    Remarque = ""
                };

                await _mediator.Send(new InsertNotReceivedCommand(NotReceived, false));
            }

            if(request.Entreprise.Publicites.Sum(p => p.Taxe_totale) > 0 && entreprise.Statut_paiement == 3)
            {
                request.Entreprise.Statut_paiement = 0;
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

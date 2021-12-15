using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class InsertNotReceivedHandler : IRequestHandler<InsertNotReceivedCommand, NotReceived>
    {
        private Context _context;
        private IMediator _mediator;
        public InsertNotReceivedHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<NotReceived> Handle(InsertNotReceivedCommand request, CancellationToken cancellationToken)
        {
            if(request.NotReceived.Remarque == null)
            {
                request.NotReceived.Remarque = "";
            }

            if(request.UpdateEntreprise == true)
            {
                await _mediator.Send(new UpdateEntreprisePVCommand(request.NotReceived), cancellationToken);
            }
           
            request.NotReceived.Date = DateTime.Now.ToString("dd/MM/yyyy");
            NotReceived notReceived = _context.non_recus
                .AsNoTracking()
                .Where(nr => nr.Matricule_ciger == request.NotReceived.Matricule_ciger && nr.ExerciceId == request.NotReceived.ExerciceId)
                .FirstOrDefault();

            if (notReceived != null)
            {
                NotReceived editNotReceived = new NotReceived
                {
                    Id = notReceived.Id,
                    Matricule_ciger = notReceived.Matricule_ciger,
                    ExerciceId = notReceived.ExerciceId,
                    Pourcentage_majoration = request.NotReceived.Pourcentage_majoration,
                    Motif_majorationId = request.NotReceived.Motif_majorationId,
                    Date = request.NotReceived.Date,
                    Remarque = request.NotReceived.Remarque
                };
                _context.non_recus.Update(editNotReceived);
            } else
            {
                _context.non_recus.Add(request.NotReceived);
            }
            _context.SaveChanges();

            return request.NotReceived;
        }
    }
}
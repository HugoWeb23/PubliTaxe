using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Taxes.Handlers
{
    public class DeleteNotReceivedHandler : IRequestHandler<DeleteNotReceivedCommand, NotReceived>
    {
        public Context _context;
        public IMediator _mediator;

        public DeleteNotReceivedHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<NotReceived> Handle(DeleteNotReceivedCommand request, CancellationToken cancellationToken)
        {
            NotReceived notReceived = _context.non_recus.AsNoTracking().Where(n => n.Id == request.Id).FirstOrDefault();

            if(notReceived == null)
            {
                throw new Exception("L'ID n'existe pas");
            }

            long EntrepriseID = notReceived.Id_entreprise;

            if(request.UpdateEntreprise)
            {
                Entreprise editentreprise = new Entreprise
                {
                    Id_entreprise = EntrepriseID,
                    Pourcentage_majoration = 0,
                    Motif_majorationId = null,
                    Proces_verbal = false
                };

                _context.entreprises.Attach(editentreprise);
                _context.Entry(editentreprise).Property(user => user.Pourcentage_majoration).IsModified = true;
                _context.Entry(editentreprise).Property(user => user.Motif_majorationId).IsModified = true;
                _context.Entry(editentreprise).Property(user => user.Proces_verbal).IsModified = true;
            }
          
            _context.non_recus.Remove(notReceived);

            _context.SaveChanges();

            return notReceived;
        }

    }
}

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
            NotReceived notReceived = _context.non_recus.Where(n => n.Id == request.Id).FirstOrDefault();

            if(notReceived == null)
            {
                throw new Exception("L'ID n'existe pas");
            }

            long EntrepriseID = notReceived.Id_entreprise;
            Entreprise entreprise = _context.entreprises.AsNoTracking().Where(e => e.Id_entreprise == EntrepriseID).FirstOrDefault();
            NotReceived LastNotReceived = _context.non_recus.Where(n => n.Id_entreprise == EntrepriseID && n.Id != notReceived.Id).OrderByDescending(n => n.Id).FirstOrDefault();
            if(LastNotReceived == null)
            {
                LastNotReceived = new NotReceived
                {
                    Pourcentage_majoration = 0,
                    Motif_majorationId = 1
                };
            }
            Entreprise editentreprise = new Entreprise
            {
                Id_entreprise = EntrepriseID,
                Pourcentage_majoration = LastNotReceived.Pourcentage_majoration,
                Motif_majorationId = LastNotReceived.Motif_majorationId,
            };

            _context.entreprises.Attach(editentreprise);
            _context.Entry(editentreprise).Property(user => user.Pourcentage_majoration).IsModified = true;
            _context.Entry(editentreprise).Property(user => user.Motif_majorationId).IsModified = true;
            _context.non_recus.Remove(notReceived);

            _context.SaveChanges();

            return LastNotReceived;
        }

    }
}

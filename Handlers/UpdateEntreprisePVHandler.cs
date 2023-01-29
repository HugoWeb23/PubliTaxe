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
    public class UpdateEntreprisePVHandler : IRequestHandler<UpdateEntreprisePVCommand, bool>
    {
        private Context _context;
        private IMediator _mediator;
        public UpdateEntreprisePVHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public Task<bool> Handle(UpdateEntreprisePVCommand request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = new Entreprise
            {
                Id_entreprise = request.NotReceived.Id_entreprise,
                Pourcentage_majoration = request.NotReceived.Pourcentage_majoration,
                Motif_majorationId = request.NotReceived.Motif_majorationId,
                Proces_verbal = request.NotReceived.Pv
            };

            _context.entreprises.Attach(entreprise);
            _context.Entry(entreprise).Property(user => user.Pourcentage_majoration).IsModified = true;
            _context.Entry(entreprise).Property(user => user.Motif_majorationId).IsModified = true;
            _context.Entry(entreprise).Property(user => user.Proces_verbal).IsModified = true;
            _context.SaveChanges();
            return Task.FromResult(true);
        }
    }
}

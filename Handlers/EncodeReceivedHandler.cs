using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Taxes.Handlers
{
    public class EncodeReceivedHandler : IRequestHandler<EncodeReceivedCommand, List<Entreprise>>
    {
        public Context _context;
        public IMediator _mediator;

        public EncodeReceivedHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<List<Entreprise>> Handle(EncodeReceivedCommand request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesByIdQuery(request.Matricules));
            entreprises.ForEach(entreprise =>
            {
                entreprise.Recu = true;
            });

            _context.entreprises.UpdateRange(entreprises);
            _context.SaveChanges();

            return entreprises;
        }
    }
}
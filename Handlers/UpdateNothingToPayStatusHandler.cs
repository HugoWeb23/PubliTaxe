using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using Taxes.ViewModels;
using Taxes.Queries;

namespace Taxes.Handlers
{
    public class UpdateNothingToPayStatusHandler : IRequestHandler<UpdateNothingToPayStatusCommand, List<long>>
    {
        public Context _context;
        public IMediator _mediator;

        public UpdateNothingToPayStatusHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<List<long>> Handle(UpdateNothingToPayStatusCommand request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesByIdQuery(request.Entreprises));
            entreprises.ForEach(entreprise =>
            {
                if(entreprise.Recu == true) {
                    entreprise.Statut_paiement = 3;
                }
            });

            _context.entreprises.UpdateRange(entreprises);
            _context.SaveChanges();

            return request.Entreprises;
        }
    }
}

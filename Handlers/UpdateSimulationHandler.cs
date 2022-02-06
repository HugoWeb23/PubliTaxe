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
    public class UpdateSimulationHandler : IRequestHandler<UpdateSimulationCommand, Simulation>
    {
        private Context _context;
        private IMediator _mediator;
        public UpdateSimulationHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<Simulation> Handle(UpdateSimulationCommand request, CancellationToken cancellationToken)
        {
         
            IEnumerable<PubliciteSimulation> pubs = await _mediator.Send(new GetSimulationAdvertisingListQuery(request.Simulation.Id_simulation));
            IEnumerable<PubliciteSimulation> test = pubs.Except(request.Simulation.Publicites).ToList();
            _context.enseignes_publicitaires_simulations.RemoveRange(test);
            _context.simulations.Update(request.Simulation);
            _context.SaveChanges();
            return request.Simulation;
        }
    }
}

using System.Collections.Generic;
using MediatR;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class GetSimulationAdvertisingListHandler : IRequestHandler<GetSimulationAdvertisingListQuery, List<PubliciteSimulation>>
    {
        public Context _context;

        public GetSimulationAdvertisingListHandler(Context context)
        {
            _context = context;
        }
        public Task<List<PubliciteSimulation>> Handle(GetSimulationAdvertisingListQuery request, CancellationToken cancellationToken)
        {
            List<PubliciteSimulation> pubs = _context.enseignes_publicitaires_simulations
                .AsNoTracking()
                .Where(p => p.Id_simulation == request.id)
                .ToList();

            return Task.FromResult(pubs);
        }
    }
}
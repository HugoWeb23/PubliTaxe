using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class GetSimulationByIdHandler : IRequestHandler<GetSimulationByIdQuery, Simulation>
    {
        public Context _context;

        public GetSimulationByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<Simulation> Handle(GetSimulationByIdQuery request, CancellationToken cancellationToken)
        {
            Simulation Simulation = _context.simulations
                .AsNoTracking()
                .Where(s => s.Id_simulation == request.id)
                .Include(s => s.Publicites)
                .ThenInclude(pub => pub.Rue)
                .ThenInclude(r => r.Code_postal)
                .Include(s => s.Code_postal)
                .ThenInclude(s => s.Pays)
                .FirstOrDefault();
       
            return Task.FromResult(Simulation);
        }
    }
}
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
    public class GetAllSimulationsHandler : IRequestHandler<GetAllSimulationsQuery, SimulationsViewModel>
    {
        public Context _context;

        public GetAllSimulationsHandler(Context context)
        {
            _context = context;
        }
        public Task<SimulationsViewModel> Handle(GetAllSimulationsQuery request, CancellationToken cancellationToken)
        {
            List<Simulation> Simulations = _context.simulations
                .AsNoTracking()
                .Include(s => s.Publicites)
                .ThenInclude(pub => pub.Rue)
                .ThenInclude(r => r.Code_postal)
                .Include(s => s.Code_postal)
                .ThenInclude(s => s.Pays)
                .OrderBy(t => t.Id_simulation)
                .ToList();
            return Task.FromResult(new SimulationsViewModel
            {
                Simulations = Simulations.Select(sim => new SimulationInfos { Id_simulation = sim.Id_simulation, Nom = sim.Nom, Nombre_panneaux = sim.Publicites.Count(), Date_creation = sim.Date_creation }).ToList(),
                TotalPages = 1,
                PageCourante = 1,
                TotalSimulations = 5,
                ElementsParPage = 15
            });
        }
    }
}

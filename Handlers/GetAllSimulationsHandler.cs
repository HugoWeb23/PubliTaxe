using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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

            int TotalElements = Simulations.Count();
            int TotalPages = (int)Math.Ceiling(TotalElements / (double)request.Filters.ElementsParPage);
            if (request.Filters.PageCourante > TotalPages)
            {
                request.Filters.PageCourante = TotalPages;
            }
            int Index = (request.Filters.PageCourante - 1) * request.Filters.ElementsParPage;
            Simulations = Simulations.Skip(Index).Take(request.Filters.ElementsParPage).OrderBy(e => e.Nom).ToList();

            return Task.FromResult(new SimulationsViewModel
            {
                Simulations = Simulations.Select(sim => new SimulationInfos { Id_simulation = sim.Id_simulation, Nom = sim.Nom, Nombre_panneaux = sim.Publicites.Count(), Date_creation = sim.Date_creation }).ToList(),
                TotalPages = TotalPages,
                PageCourante = request.Filters.PageCourante,
                TotalSimulations = TotalElements,
                ElementsParPage = request.Filters.ElementsParPage
            });
        }
    }
}

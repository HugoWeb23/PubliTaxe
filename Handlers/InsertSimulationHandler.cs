using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class InsertSimulationHandler : IRequestHandler<InsertSimulationCommand, Simulation>
    {
        private Context _context;
        public InsertSimulationHandler(Context context)
        {
            _context = context;
        }

        public Task<Simulation> Handle(InsertSimulationCommand request, CancellationToken cancellationToken)
        {
            request.Simulation.Date_creation = DateTime.Now.ToString("dd/MM/yyyy");
            _context.simulations.Add(request.Simulation);
            _context.SaveChanges();
            return Task.FromResult(request.Simulation);
        }
    }
}

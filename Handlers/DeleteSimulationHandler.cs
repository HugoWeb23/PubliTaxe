using System.Collections.Generic;
using MediatR;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Entities;
using System;

namespace Taxes.Handlers
{
    public class DeleteSimulationHandler : IRequestHandler<DeleteSimulationCommand, bool>
    {
        public Context _context;

        public DeleteSimulationHandler(Context context)
        {
            _context = context;
        }
        public Task<bool> Handle(DeleteSimulationCommand request, CancellationToken cancellationToken)
        {
            Simulation simulation = _context.simulations.FirstOrDefault(ent => ent.Id_simulation == request.Id_simulation);
            if (simulation == null)
            {
                throw new Exception("La simulation est introuvable");
            }
            _context.simulations.Remove(simulation);
            _context.SaveChanges();
            return Task.FromResult(true);

        }
    }
}
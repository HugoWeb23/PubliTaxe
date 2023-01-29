using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record InsertSimulationCommand(Simulation Simulation) : IRequest<Simulation>;
}

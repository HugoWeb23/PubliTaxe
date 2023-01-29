using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateSimulationCommand(Simulation Simulation) : IRequest<Simulation>;
}

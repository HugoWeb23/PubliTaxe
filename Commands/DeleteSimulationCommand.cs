using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteSimulationCommand(long Id_simulation) : IRequest<bool>;
}

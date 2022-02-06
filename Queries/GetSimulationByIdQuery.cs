using MediatR;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetSimulationByIdQuery(long id) : IRequest<Simulation>;
}


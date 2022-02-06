using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetSimulationAdvertisingListQuery(long id) : IRequest<List<PubliciteSimulation>>;
}


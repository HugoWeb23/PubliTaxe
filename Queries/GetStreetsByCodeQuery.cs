using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetStreetsByCodeQuery(string Code_rue) : IRequest<List<Rue>>;

}

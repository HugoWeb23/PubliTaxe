using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetPostalCodesByLocalityQuery(string locality) : IRequest<List<Code_postal>>;
}

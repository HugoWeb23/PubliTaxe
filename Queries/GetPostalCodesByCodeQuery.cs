using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetPostalCodesByCodesQuery(string code) : IRequest<List<Code_postal>>;
}

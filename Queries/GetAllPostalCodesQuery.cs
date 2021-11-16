using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
        public record GetAllPostalCodesQuery() : IRequest<List<Code_postal>>;
}

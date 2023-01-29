using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetAdvertisingListByMatriculeQuery(long ID) : IRequest<List<Publicite>>;
}

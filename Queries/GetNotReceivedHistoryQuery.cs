using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetNotReceivedHistoryQuery(long ID) : IRequest<IEnumerable<object>>;
}

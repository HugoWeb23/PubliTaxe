using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetAllAdvertisingByFiscalYearQuery() : IRequest<List<Publicite>>;
}

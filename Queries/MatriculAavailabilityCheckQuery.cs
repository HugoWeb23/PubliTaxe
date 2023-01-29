using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record MatriculAavailabilityCheckQuery(long Matricule) : IRequest<bool>;
}

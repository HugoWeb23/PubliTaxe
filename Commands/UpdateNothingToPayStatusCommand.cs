using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateNothingToPayStatusCommand(List<long> Entreprises) : IRequest<List<long>>;
}

using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record EncodeReceivedCommand(List<long> Entreprises) : IRequest<List<Entreprise>>;
}

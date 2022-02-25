using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdatePaymentCommand(Paiement Payment) : IRequest<Paiement>;
}

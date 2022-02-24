using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record InsertPaymentCommand(Paiement Payment) : IRequest<Paiement>;
}

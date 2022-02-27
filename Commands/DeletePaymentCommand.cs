using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeletePaymentCommand(long PaymentId) : IRequest<bool>;
}
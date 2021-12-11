using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdatePriceCommand(Tarif Price) : IRequest<Tarif>;
}

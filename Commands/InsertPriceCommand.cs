using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record InsertPriceCommand(Tarif Price) : IRequest<Tarif>;
}

using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteImageCommand(string Image) : IRequest<bool>;
}

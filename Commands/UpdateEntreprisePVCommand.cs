using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateEntreprisePVCommand(NotReceived NotReceived) : IRequest<bool>;
}

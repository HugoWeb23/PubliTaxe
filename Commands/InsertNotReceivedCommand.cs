using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record InsertNotReceivedCommand(NotReceived NotReceived) : IRequest<NotReceived>;
}

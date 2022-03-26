using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteNotReceivedCommand(long Id) : IRequest<NotReceived>;
}
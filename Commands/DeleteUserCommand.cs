using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteUserCommand(long UserID) : IRequest<bool>;
}
using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record GenerateNewUserPasswordCommand(long UserID) : IRequest<string>;
}


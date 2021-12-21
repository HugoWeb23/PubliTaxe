using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateUserCommand(Utilisateur User) : IRequest<Utilisateur>;
}

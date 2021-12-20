using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record NewUserCommand(Utilisateur User) : IRequest<Utilisateur>;
}

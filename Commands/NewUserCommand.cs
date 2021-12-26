using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record NewUserCommand(Utilisateur User) : IRequest<UserWithoutPassViewModel>;
}

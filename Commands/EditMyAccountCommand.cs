using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record EditMyAccountCommand(Utilisateur User) : IRequest<UserWithoutPassViewModel>;
}

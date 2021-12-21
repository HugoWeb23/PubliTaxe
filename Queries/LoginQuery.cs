using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record LoginQuery(LoginViewModel User) : IRequest<UserLoginViewModel>;
}
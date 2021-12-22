using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record ChangePasswordCommand(ChangePasswordViewModel Data) : IRequest<bool>;
}

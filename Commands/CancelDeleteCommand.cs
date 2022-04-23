using MediatR;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Commands
{
    public record CancelDeleteCommand(long Id_entreprise) : IRequest<long>;
}

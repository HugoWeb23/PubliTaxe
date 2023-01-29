using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteEntrepriseCommand(long ID) : IRequest<bool>;
}

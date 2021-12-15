using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record DeleteEntrepriseCommand(long Matricule) : IRequest<bool>;
}

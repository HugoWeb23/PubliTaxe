using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateEntrepriseCommand(Entreprise Entreprise) : IRequest<Entreprise>;
}

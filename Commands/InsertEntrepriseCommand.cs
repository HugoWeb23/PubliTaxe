using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record InsertEntrepriseCommand(Entreprise Entreprise) : IRequest<Entreprise>;
}


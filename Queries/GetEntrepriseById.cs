using MediatR;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntrepriseById(long matricule) : IRequest<Entreprise>;
}

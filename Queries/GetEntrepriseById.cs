using MediatR;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntrepriseById(int matricule) : IRequest<Entreprise>;
}

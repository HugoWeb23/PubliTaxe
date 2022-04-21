using MediatR;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntrepriseByMatricule(long Matricule) : IRequest<Entreprise>;
}


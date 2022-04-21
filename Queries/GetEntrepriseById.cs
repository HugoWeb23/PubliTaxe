using MediatR;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntrepriseById(long ID) : IRequest<Entreprise>;
}

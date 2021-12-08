using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntreprisesByCityType(int citytype) : IRequest<List<Entreprise>>;
}
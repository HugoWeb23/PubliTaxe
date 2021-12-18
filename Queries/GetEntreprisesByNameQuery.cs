using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntreprisesByNameQuery(string Name) : IRequest<List<Entreprise>>;
}

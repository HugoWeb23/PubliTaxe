using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntreprisesByIdQuery(List<long> Matricules) : IRequest<List<Entreprise>>;
}

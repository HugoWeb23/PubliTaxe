using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record SearchEntrepriseByIdQuery(long Matricule) : IRequest<List<Entreprise>>;
}

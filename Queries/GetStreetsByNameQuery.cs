using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetStreetsByNameQuery(string Nom_rue) : IRequest<List<Rue>>;

}

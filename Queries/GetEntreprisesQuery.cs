using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetEntreprisesQuery() : IRequest<List<Entreprise>>;

    public class GetEntreprisesQueryClass : IRequest<List<Entreprise>>
    {

    }
}

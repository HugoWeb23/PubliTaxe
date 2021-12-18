using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Taxes.Handlers
{
    public class GetEntrepriseByNameHandler : IRequestHandler<GetEntreprisesByNameQuery, List<Entreprise>>
    {
        public Context _context;

        public GetEntrepriseByNameHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetEntreprisesByNameQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> Entreprises = _context.entreprises
                .Where(ent => ent.Nom.Contains(request.Name))
                .Include(ent => ent.Publicites)
                .ToList();

            return Task.FromResult(Entreprises);
        }
    }
}

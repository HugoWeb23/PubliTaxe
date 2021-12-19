using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Services;

namespace Taxes.Handlers
{
    public class GetEntreprisesListHandler : IRequestHandler<GetEntreprisesQuery, List<Entreprise>>
    {
        public Context _context;

        public GetEntreprisesListHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetEntreprisesQuery request, CancellationToken cancellationToken)
        {

            var predicate = PredicateBuilder.True<Entreprise>();

            if (!string.IsNullOrEmpty(request.Filters.Nom)) {
                predicate = predicate.And(ent => ent.Nom.Contains(request.Filters.Nom));
            }
            
            if(request.Filters.PubExoneration)
            {
                predicate = predicate.And(ent => ent.Publicites.Any(p => p.Exoneration == true));
            }

            if (request.Filters.Rue != null)
            {
                predicate = predicate.And(ent => ent.Publicites.Any(p => p.Id_rue == request.Filters.Rue));
            }

            List<Entreprise> entreprises = _context.entreprises
                .Include(ent => ent.Publicites)
                .Where(predicate)
                .ToList();

            return Task.FromResult(entreprises);
        }
    }
}

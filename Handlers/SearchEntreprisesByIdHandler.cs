using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Taxes.Handlers
{
    public class SearchEntreprisesByIdhandler : IRequestHandler<SearchEntrepriseByIdQuery, List<Entreprise>>
    {
        public Context _context;

        public SearchEntreprisesByIdhandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(SearchEntrepriseByIdQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> codes_postaux = _context.entreprises
                .Include(ent => ent.Publicites)
                .Where(ent => ent.Matricule_ciger.ToString().Contains((char)request.Matricule))
                .ToList();
            return Task.FromResult(codes_postaux);
        }
    }
}
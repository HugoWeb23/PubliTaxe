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
    public class GetEntreprisesByCityTypeHandler : IRequestHandler<GetEntreprisesByCityType, List<Entreprise>>
    {
        public Context _context;

        public GetEntreprisesByCityTypeHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetEntreprisesByCityType request, CancellationToken cancellationToken)
        {
                if(request.citytype == 1)
                {
                List<Entreprise> entreprises = _context.entreprises
               .Where(ent => ent.Code_postal.CP == "7700" || ent.Code_postal.CP == "7711" || ent.Code_postal.CP == "7712")
               .Include(ent => ent.Publicites)
               .ThenInclude(rue => rue.Rue)
               .ThenInclude(rue => rue.Code_postal)
               .Include(ent => ent.Code_postal)
               .ThenInclude(cp => cp.Pays)
               .ToList();
                return Task.FromResult(entreprises);
                } else
                {
                List<Entreprise> entreprises = _context.entreprises
               .Where(ent => ent.Code_postal.CP != "7700" && ent.Code_postal.CP != "7711" && ent.Code_postal.CP != "7712")
               .Include(ent => ent.Publicites)
               .ThenInclude(rue => rue.Rue)
               .ThenInclude(rue => rue.Code_postal)
               .Include(ent => ent.Code_postal)
               .ThenInclude(cp => cp.Pays)
               .ToList();
                return Task.FromResult(entreprises);
                }
        }
    }
}

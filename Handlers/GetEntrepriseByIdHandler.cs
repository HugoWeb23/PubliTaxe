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
    public class GetEntrepriseByIdHandler : IRequestHandler<GetEntrepriseById, Entreprise>
    {
        public Context _context;

        public GetEntrepriseByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<Entreprise> Handle(GetEntrepriseById request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises
                .AsNoTracking()
                .Include(ent => ent.Publicites)
                .ThenInclude(rue => rue.Rue)
                .ThenInclude(rue => rue.Code_postal)
                .Include(ent => ent.Code_postal)
                .ThenInclude(cp => cp.Pays)
                .Include(ent => ent.Publicites)
                .ThenInclude(pub => pub.Photos)
                .FirstOrDefault(ent => ent.Matricule_ciger == request.matricule);
               
            return Task.FromResult(entreprise);
        }
    }
}
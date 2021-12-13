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
    public class GetNotReceivedHandler : IRequestHandler<GetNotReceivedQuery, List<Entreprise>>
    {
        public Context _context;

        public GetNotReceivedHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetNotReceivedQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises
                .Include(ent => ent.Publicites)
                 .Where(ent => ent.Recu == false)
                // Sélectionne les entreprises qui n'ont pas encore un non recu d'encodé
                .Where(ent => !_context.non_recus.Where(n => n.ExerciceId == request.Fiscalyear).Select(n => n.Matricule_ciger).Contains(ent.Matricule_ciger))
                .ToList();
            return Task.FromResult(entreprises);
        }
    }
}

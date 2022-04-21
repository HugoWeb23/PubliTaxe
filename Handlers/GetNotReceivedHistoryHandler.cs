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
    public class GetNotReceivedHistoryHandler : IRequestHandler<GetNotReceivedHistoryQuery, IEnumerable<object>>
    {
        public Context _context;

        public GetNotReceivedHistoryHandler(Context context)
        {
            _context = context;
        }
        public Task<IEnumerable<object>> Handle(GetNotReceivedHistoryQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<object> NotReceivedList = _context.non_recus
                 .Join(_context.exercices, n => n.ExerciceId, e => e.Id, (n, e) => new
                 {
                     Id = n.Id,
                     Id_entreprise = n.Id_entreprise,
                     Motif_majorationId = n.Motif_majorationId,
                     ExerciceId = n.ExerciceId,
                     Remarque = n.Remarque,
                     Pourcentage_majoration = n.Pourcentage_majoration,
                     Date = n.Date,
                     Exercice = e.Annee_exercice
                 })
                 .Where(n => n.Id_entreprise == request.ID)
                 .OrderByDescending(n => n.Exercice);

            return Task.FromResult(NotReceivedList);
        }
    }
}

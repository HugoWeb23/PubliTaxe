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
                     Matricule_ciger = n.Matricule_ciger,
                     Motif_majorationId = n.Motif_majorationId,
                     ExerciceId = n.ExerciceId,
                     Remarque = n.Remarque,
                     Pourcentage_majoration = n.Pourcentage_majoration,
                     Date = n.Date,
                     Exercice = e.Annee_exercice
                 })
                 .Where(n => n.Matricule_ciger == request.Matricule);

            return Task.FromResult(NotReceivedList);
        }
    }
}

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Handlers
{
    public class GetAllPricesHandler : IRequestHandler<GetAllPricesQuery, List<Tarif>>
    {
        public Context _context;
        private IMediator _mediator;

        public GetAllPricesHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<List<Tarif>> Handle(GetAllPricesQuery request, CancellationToken cancellationToken)
        {
            List<Exercice> Exercices = await _mediator.Send(new GetAllFiscalYearsQuery());
            List<Tarif> Tarifs = _context.tarifs
                .OrderBy(t => t.ExerciceId)
                .ToList();
            Tarifs.Sort((a, b) => Exercices.Find(e => e.Id == a.ExerciceId).Annee_exercice > Exercices.Find(e => e.Id == b.ExerciceId).Annee_exercice ? -1 : 1);
            return Tarifs;
        }
    }
}

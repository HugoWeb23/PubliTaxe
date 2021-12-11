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
    public class GetAllFiscalYearsHandler : IRequestHandler<GetAllFiscalYearsQuery, List<Exercice>>
    {
        public Context _context;

        public GetAllFiscalYearsHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Exercice>> Handle(GetAllFiscalYearsQuery request, CancellationToken cancellationToken)
        {
            List<Exercice> exercices = _context.exercices
                .OrderBy(t => t.Annee_exercice)
                .ToList();
            return Task.FromResult(exercices);
        }
    }
}
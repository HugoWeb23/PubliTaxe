using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Handlers
{
    public class GetCurrentFiscalYearHandler : IRequestHandler<GetCurrentFiscalYearQuery, Exercice>
    {
        public Context _context;

        public GetCurrentFiscalYearHandler(Context context)
        {
            _context = context;
        }
        public Task<Exercice> Handle(GetCurrentFiscalYearQuery request, CancellationToken cancellationToken)
        {
            Exercice exercice = _context.exercices
                .Where(ex => ex.Id == _context.informations.OrderBy(info => info.Id).First().Exercice_courant)
                .FirstOrDefault();
            return Task.FromResult(exercice);
        }
    }
}


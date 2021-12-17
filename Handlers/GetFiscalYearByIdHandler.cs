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
    public class GetFiscalYearByIdHandler : IRequestHandler<GetFiscalYearByIdQuery, Exercice>
    {
        public Context _context;

        public GetFiscalYearByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<Exercice> Handle(GetFiscalYearByIdQuery request, CancellationToken cancellationToken)
        {
            Exercice FiscalYear = _context.exercices
                 .Where(ex => ex.Id == request.FiscalYearId)
                 .FirstOrDefault();

            if(FiscalYear == null)
            {
                throw new Exception("L'exercice n'existe pas");
            }

            return Task.FromResult(FiscalYear);
        }
    }
}

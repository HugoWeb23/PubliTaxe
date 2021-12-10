using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class InsertFiscalYearHandler : IRequestHandler<InsertFiscalYearCommand, Exercice>
    {
        private Context _context;
        public InsertFiscalYearHandler(Context context)
        {
            _context = context;
        }

        public Task<Exercice> Handle(InsertFiscalYearCommand request, CancellationToken cancellationToken)
        {
            Exercice check_year = _context.exercices.FirstOrDefault(fisc => fisc.Annee_exercice == request.FiscalYear.Annee_exercice);
            if (check_year != null)
            {
                throw new Exception("Un exercice est déjà lié à cette année !");
            }
            _context.exercices.Add(request.FiscalYear);
            _context.SaveChanges();
            return Task.FromResult(request.FiscalYear);
        }
    }
}

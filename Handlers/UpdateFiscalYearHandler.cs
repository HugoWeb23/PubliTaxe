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
    public class UpdateFiscalYearHandler : IRequestHandler<UpdateFiscalYearCommand, Exercice>
    {
        private Context _context;
        public UpdateFiscalYearHandler(Context context)
        {
            _context = context;
        }

        public Task<Exercice> Handle(UpdateFiscalYearCommand request, CancellationToken cancellationToken)
        {
            Exercice CurrentFiscalYear = _context.exercices.AsNoTracking().FirstOrDefault(f => f.Id == request.FiscalYear.Id);
            if(request.FiscalYear.Annee_exercice != CurrentFiscalYear.Annee_exercice)
            {
                Exercice check_year = _context.exercices.AsNoTracking().FirstOrDefault(fisc => fisc.Annee_exercice == request.FiscalYear.Annee_exercice);
                if (check_year != null)
                {
                    throw new Exception("Un exercice est déjà lié à cette année !");
                }
            }
            
            _context.Entry(request.FiscalYear).State = EntityState.Modified;
            _context.exercices.Update(request.FiscalYear);
            _context.SaveChanges();
            return Task.FromResult(request.FiscalYear);
        }
    }
}

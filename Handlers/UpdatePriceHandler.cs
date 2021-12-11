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
    public class UpdatePriceHandler : IRequestHandler<UpdatePriceCommand, Tarif>
    {
        private Context _context;
        public UpdatePriceHandler(Context context)
        {
            _context = context;
        }

        public Task<Tarif> Handle(UpdatePriceCommand request, CancellationToken cancellationToken)
        {
            Tarif CurrentPrice = _context.tarifs.AsNoTracking().FirstOrDefault(t => t.Id == request.Price.Id);
            if (request.Price.ExerciceId != CurrentPrice.ExerciceId)
            {
                Tarif CheckFiscalYear = _context.tarifs.FirstOrDefault(t => t.ExerciceId == request.Price.ExerciceId);
                if (CheckFiscalYear != null)
                {
                    throw new Exception("Un tarif est déjà lié à cet exercice !");
                }
            }

            _context.Entry(request.Price).State = EntityState.Modified;
            _context.tarifs.Update(request.Price);
            _context.SaveChanges();
            return Task.FromResult(request.Price);
        }
    }
}

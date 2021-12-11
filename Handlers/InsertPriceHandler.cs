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
    public class InsertPriceHandler : IRequestHandler<InsertPriceCommand, Tarif>
    {
        private Context _context;
        public InsertPriceHandler(Context context)
        {
            _context = context;
        }

        public Task<Tarif> Handle(InsertPriceCommand request, CancellationToken cancellationToken)
        {
            Tarif checkPriceYear = _context.tarifs.FirstOrDefault(t => t.ExerciceId == request.Price.ExerciceId);
            if(checkPriceYear != null)
            {
                throw new Exception("Un tarif est déjà lié à cet exercice");
            }
            _context.tarifs.Add(request.Price);
            _context.SaveChanges();

            return Task.FromResult(request.Price);
        }
    }
}
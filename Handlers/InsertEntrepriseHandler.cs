using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class InsertEntrepriseHandler : IRequestHandler<InsertEntrepriseCommand, Entreprise>
    {
        private Context _context;
        public InsertEntrepriseHandler(Context context)
        {
            _context = context;
        }

        public Task<Entreprise> Handle(InsertEntrepriseCommand request, CancellationToken cancellationToken)
        {
            _context.entreprises.Add(request.Entreprise);
            _context.Entry(request.Entreprise).State = EntityState.Added;
            _context.SaveChanges();
            return Task.FromResult(request.Entreprise);
        }
    }
}

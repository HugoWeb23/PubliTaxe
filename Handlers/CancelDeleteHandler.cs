using System.Collections.Generic;
using MediatR;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Entities;
using System;

namespace Taxes.Handlers
{
    public class CancelDeleteHandler : IRequestHandler<CancelDeleteCommand, long>
    {
        public Context _context;

        public CancelDeleteHandler(Context context)
        {
            _context = context;
        }
        public Task<long> Handle(CancelDeleteCommand request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises.OrderBy(ent => ent.Id_entreprise).FirstOrDefault(ent => ent.Id_entreprise == request.Id_entreprise);
            if (entreprise == null)
            {
                throw new Exception("L'entreprise n'existe pas");
            }
            entreprise.Suppression = false;

            _context.SaveChanges();
            return Task.FromResult(entreprise.Id_entreprise);

        }
    }
}
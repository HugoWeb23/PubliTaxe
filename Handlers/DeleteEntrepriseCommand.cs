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
    public class DeleteEntrepriseHandler : IRequestHandler<DeleteEntrepriseCommand, bool>
    {
        public Context _context;

        public DeleteEntrepriseHandler(Context context)
        {
            _context = context;
        }
        public Task<bool> Handle(DeleteEntrepriseCommand request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises.FirstOrDefault(ent => ent.Id_entreprise == request.ID);
            if(entreprise == null)
            {
                throw new Exception("L'entreprise est introuvable");
            }

            if (entreprise.Suppression) throw new Exception("La suppression de cette entreprise est déjà programmée");

            entreprise.Suppression = true;

            _context.SaveChanges();
            return Task.FromResult(true);
           
        }
    }
}
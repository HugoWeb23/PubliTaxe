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
            if (entreprise.Proces_verbal == true) throw new Exception("L'entreprise ne peut pas être supprimée car elle est en infraction");

                _context.entreprises.Remove(entreprise);
                _context.SaveChanges();
                return Task.FromResult(true);
           
        }
    }
}
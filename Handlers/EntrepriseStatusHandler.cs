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
    public class EntrepriseStatusHandler : IRequestHandler<EntrepriseStatusCommand, bool>
    {
        private Context _context;
        public EntrepriseStatusHandler(Context context)
        {
            _context = context;
        }

        public Task<bool> Handle(EntrepriseStatusCommand request, CancellationToken cancellationToken)
        {
            Entreprise CheckEntreprise = _context.entreprises.AsNoTracking().SingleOrDefault(ent => ent.Id_entreprise == request.Id);
            if (CheckEntreprise == null)
            {
                throw new Exception("L'entreprise n'existe pas");
            }

            if (request.type == 1)
            {
                CheckEntreprise.Desactive = true;
            } else if (request.type == 2)
            {
                CheckEntreprise.Desactive = false;
            }
           
            _context.entreprises.Update(CheckEntreprise);
            _context.SaveChanges();

            return Task.FromResult(true);

        }
    }
}

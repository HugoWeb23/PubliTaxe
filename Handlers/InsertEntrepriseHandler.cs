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
    public class InsertEntrepriseHandler : IRequestHandler<InsertEntrepriseCommand, Entreprise>
    {
        private Context _context;
        public InsertEntrepriseHandler(Context context)
        {
            _context = context;
        }

        public Task<Entreprise> Handle(InsertEntrepriseCommand request, CancellationToken cancellationToken)
        {
            Entreprise check_mat = _context.entreprises.FirstOrDefault(ent => ent.Matricule_ciger == request.Entreprise.Matricule_ciger);
            if(check_mat != null)
            {
                throw new Exception("Une entreprise possède déjà ce matricule");
            }
            _context.entreprises.Add(request.Entreprise);
            _context.Entry(request.Entreprise).State = EntityState.Added;
            _context.SaveChanges();
            return Task.FromResult(request.Entreprise);
        }
    }
}

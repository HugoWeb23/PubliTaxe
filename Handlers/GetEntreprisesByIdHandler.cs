using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Services;
using System;

namespace Taxes.Handlers
{
    public class GetEntreprisesByIdHandler : IRequestHandler<GetEntreprisesByIdQuery, List<Entreprise>>
    {
        public Context _context;

        public GetEntreprisesByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetEntreprisesByIdQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises
                .AsNoTracking()
                .Where(ent => request.ID.Contains(ent.Id_entreprise))
                .ToList();

            if (entreprises == null)
            {
                throw new Exception("L'entreprise n'existe pas");
            }

            return Task.FromResult(entreprises);
        }
    }
}
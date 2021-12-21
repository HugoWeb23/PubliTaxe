using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Taxes.Handlers
{
    public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<Utilisateur>>
    {
        public Context _context;

        public GetAllUsersHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Utilisateur>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            List<Utilisateur> Utilisateurs = _context.utilisateurs.ToList();

            return Task.FromResult(Utilisateurs);
        }
    }
}

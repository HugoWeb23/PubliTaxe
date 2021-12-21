using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, Utilisateur>
    {
        public Context _context;

        public GetUserByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<Utilisateur> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            Utilisateur User = _context.utilisateurs
                .AsNoTracking()
                .FirstOrDefault(user => user.Id == request.Id);

            return Task.FromResult(User);
        }
    }
}

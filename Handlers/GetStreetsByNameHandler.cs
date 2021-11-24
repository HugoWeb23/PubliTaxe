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
    public class GetSreetsByNameHandler : IRequestHandler<GetStreetsByNameQuery, List<Rue>>
    {
        public Context _context;

        public GetSreetsByNameHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Rue>> Handle(GetStreetsByNameQuery request, CancellationToken cancellationToken)
        {
            List<Rue> Rues = _context.rues
                .Where(rue => rue.Nom_rue == request.Nom_rue)
                .Include(rue => rue.Code_postal)
                .ToList();
            return Task.FromResult(Rues);
        }
    }
}

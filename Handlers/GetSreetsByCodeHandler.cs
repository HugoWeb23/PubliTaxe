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
    public class GetSreetsByCodeHandler : IRequestHandler<GetStreetsByCodeQuery, List<Rue>>
    {
        public Context _context;

        public GetSreetsByCodeHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Rue>> Handle(GetStreetsByCodeQuery request, CancellationToken cancellationToken)
        {
            List<Rue> Rues = _context.rues
                .Where(rue => rue.Code_rue == request.Code_rue)
                .Include(rue => rue.Code_postal)
                .ToList();
            return Task.FromResult(Rues);
        }
    }
}

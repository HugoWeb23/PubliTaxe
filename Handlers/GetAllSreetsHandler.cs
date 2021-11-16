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
    public class GetAllSreetsHandler : IRequestHandler<GetAllStreetsQuery, List<Rue>>
    {
        public Context _context;

        public GetAllSreetsHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Rue>> Handle(GetAllStreetsQuery request, CancellationToken cancellationToken)
        {
            List<Rue> Rues = _context.rues
                .Include(rue => rue.Code_postal)
                .ToList();
            return Task.FromResult(Rues);
        }
    }
}

using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Taxes.Handlers
{
    public class GetPostalCodesByLocalityHandler : IRequestHandler<GetPostalCodesByLocalityQuery, List<Code_postal>>
    {
        public Context _context;

        public GetPostalCodesByLocalityHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Code_postal>> Handle(GetPostalCodesByLocalityQuery request, CancellationToken cancellationToken)
        {
            List<Code_postal> codes = _context.codes_postaux
                .Where(code => code.Localite.Contains(request.locality))
                .Include(cp => cp.Pays)
                .ToList();
            return Task.FromResult(codes);
        }
    }
}
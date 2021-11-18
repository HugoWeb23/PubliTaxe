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
    public class GetPostalCodesByCodeHandler : IRequestHandler<GetPostalCodesByCodesQuery, List<Code_postal>>
    {
        public Context _context;

        public GetPostalCodesByCodeHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Code_postal>> Handle(GetPostalCodesByCodesQuery request, CancellationToken cancellationToken)
        {
            List<Code_postal> codes_postaux = _context.codes_postaux
                .Where(code => code.CP == request.code)
                .Include(cp => cp.Pays)
                .ToList();
            return Task.FromResult(codes_postaux);
        }
    }
}
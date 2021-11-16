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
    public class GetAllPostalCodesHandler : IRequestHandler<GetAllPostalCodesQuery, List<Code_postal>>
    {
        public Context _context;

        public GetAllPostalCodesHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Code_postal>> Handle(GetAllPostalCodesQuery request, CancellationToken cancellationToken)
        {
            List<Code_postal> codes_postaux = _context.codes_postaux
                .Include(code => code.Pays)
                .ToList();
            return Task.FromResult(codes_postaux);
        }
    }
}
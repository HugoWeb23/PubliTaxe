using System.Collections.Generic;
using MediatR;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class GetAdvertisingListByMatriculeHandler : IRequestHandler<GetAdvertisingListByMatriculeQuery, List<Publicite>>
    {
        public Context _context;

        public GetAdvertisingListByMatriculeHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Publicite>> Handle(GetAdvertisingListByMatriculeQuery request, CancellationToken cancellationToken)
        {
            List<Publicite> pubs = _context.enseignes_publicitaires
                .AsNoTracking()
                .Where(p => p.Matricule_ciger == request.Mat)
                .ToList();

            return Task.FromResult(pubs);
        }
    }
}
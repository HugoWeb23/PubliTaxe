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
    public class GetAllReasonsHandler : IRequestHandler<GetAllReasonsQuery, List<MotifMajoration>>
    {
        public Context _context;

        public GetAllReasonsHandler(Context context)
        {
            _context = context;
        }
        public Task<List<MotifMajoration>> Handle(GetAllReasonsQuery request, CancellationToken cancellationToken)
        {
            List<MotifMajoration> motifs_majoration = _context.motifs_majoration.ToList();
            return Task.FromResult(motifs_majoration);
        }
    }
}
using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;

namespace Taxes.Handlers
{
    public class GetEntreprisesListHandler : IRequestHandler<GetEntreprisesQuery, List<Entreprise>>
    {
        public Context _context;

        public GetEntreprisesListHandler(Context context)
        {
            _context = context;
        }
        public Task<List<Entreprise>> Handle(GetEntreprisesQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises.ToList();
            return Task.FromResult(entreprises);
        }
    }
}

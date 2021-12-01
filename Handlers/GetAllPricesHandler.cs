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
    public class GetAllPricesHandler : IRequestHandler<GetAllPricesQuery, List<Tarif>>
    {
        public Context _context;

        public GetAllPricesHandler(Context context, IMediator mediator)
        {
            _context = context;
        }
        public Task<List<Tarif>> Handle(GetAllPricesQuery request, CancellationToken cancellationToken)
        {
            List<Tarif> Tarifs = _context.tarifs
                .ToList();
            return Task.FromResult(Tarifs);
        }
    }
}

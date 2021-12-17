using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using System.Collections.Generic;
using Taxes.Queries;
using System.Linq;
using MediatR;

namespace Taxes.Handlers
{
    public class GetAllAdvertisingByFiscalYearhandler : IRequestHandler<GetAllAdvertisingByFiscalYearQuery, List<Publicite>>
    {
        private Context _context;
        private IMediator _mediator;
        public GetAllAdvertisingByFiscalYearhandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public Task<List<Publicite>> Handle(GetAllAdvertisingByFiscalYearQuery request, CancellationToken cancellationToken)
        {
            List<Publicite> pubs = _context.enseignes_publicitaires
                .ToList();

            return Task.FromResult(pubs);
        }
    }
}
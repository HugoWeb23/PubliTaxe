using System.Collections.Generic;
using Taxes.Entities;
using Taxes.Queries;
using MediatR;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Services
{
    public class SumTax
    {
        private IMediator _mediator;
        public SumTax(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<decimal> Sum(short Type_publicite, short Quantite, short Face, decimal Surface)
        {

            List<Tarif> tarifs = await _mediator.Send(new GetAllPricesQuery());
            return decimal.MaxValue;
        }

    }
}

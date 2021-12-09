using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Queries;
using Taxes.Entities;
using System.Collections.Generic;

namespace Taxes.Handlers
{
    public class SumTaxHandler : IRequestHandler<SumTaxQuery, decimal>
    {
        private Context _context;
        private readonly IMediator _mediator;
        public SumTaxHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<decimal> Handle(SumTaxQuery request, CancellationToken cancellationToken)
        {
            Dictionary<int, string> PricesNames = new Dictionary<int, string>()
            {

            {1, "Prix_unitaire_enseigne_non_lumineuse" },
            {2, "Prix_unitaire_enseigne_lumineuse" },
            {3,"Prix_unitaire_enseigne_clignotante" },
            {4, "Prix_unitaire_panneau_non_lumineux" },
            {5, "Prix_unitaire_panneau_lumineux" },
            {6, "Prix_unitaire_panneau_a_defilement" }

            };

            List<Tarif> tarifs = await _mediator.Send(new GetAllPricesQuery());

            string PubName = PricesNames.FirstOrDefault(price => price.Key == request.Type_publicite).Value;
            Tarif tarif = tarifs.First(p => p.Exercice == request.Exercice);
            decimal price = (decimal)tarif.GetType().GetProperty(PubName).GetValue(tarif, null);

            decimal sum = price * request.Surface * request.Quantite * request.Face;

            return Math.Round(sum, 2);
        }
    }
}

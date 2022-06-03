using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Taxes.Handlers
{
    public class GetEntreprisesByMinutesHandler : IRequestHandler<GetEntreprisesByMinutesQuery, List<Entreprise>>
    {
        public Context _context;
        private IMediator _mediator;

        public GetEntreprisesByMinutesHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<List<Entreprise>> Handle(GetEntreprisesByMinutesQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> Entreprises = _context.entreprises
                .Where(ent => ent.Proces_verbal == true)
                .Where(ent => ent.Desactive == false)
                .Include(ent => ent.Publicites)
                .ThenInclude(rue => rue.Rue)
                .ThenInclude(rue => rue.Code_postal)
                .Include(ent => ent.Code_postal)
                .ThenInclude(cp => cp.Pays)
                .ToList();

            foreach (Entreprise entreprise in Entreprises)
            {
                foreach (var ent in entreprise.Publicites)
                {
                    ent.Taxe_totale = ent.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface));
                    ent.Surface_totale = ent.Quantite * ent.Surface;
                }
            }

            return Entreprises;
        }
    }
}

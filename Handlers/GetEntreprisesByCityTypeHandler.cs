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
    public class GetEntreprisesByCityTypeHandler : IRequestHandler<GetEntreprisesByCityType, List<Entreprise>>
    {
        public Context _context;
        private IMediator _mediator;

        public GetEntreprisesByCityTypeHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<List<Entreprise>> Handle(GetEntreprisesByCityType request, CancellationToken cancellationToken)
        {
                if(request.citytype == 1)
                {
                List<Entreprise> entreprises = _context.entreprises
               .Where(ent => ent.Code_postal.CP == "7700" || ent.Code_postal.CP == "7711" || ent.Code_postal.CP == "7712")
               .Include(ent => ent.Publicites)
               .ThenInclude(rue => rue.Rue)
               .ThenInclude(rue => rue.Code_postal)
               .Include(ent => ent.Code_postal)
               .ThenInclude(cp => cp.Pays)
               .ToList();
                foreach(Entreprise entreprise in entreprises)
                {
                    foreach (var ent in entreprise.Publicites)
                    {
                        ent.Taxe_totale = ent.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface));
                        ent.Surface_totale = ent.Quantite * ent.Surface;
                    }
                }
                return entreprises;
                } else
                {
                List<Entreprise> entreprises = _context.entreprises
               .Where(ent => ent.Code_postal.CP != "7700" && ent.Code_postal.CP != "7711" && ent.Code_postal.CP != "7712")
               .Include(ent => ent.Publicites)
               .ThenInclude(rue => rue.Rue)
               .ThenInclude(rue => rue.Code_postal)
               .Include(ent => ent.Code_postal)
               .ThenInclude(cp => cp.Pays)
               .ToList();

                foreach (Entreprise entreprise in entreprises)
                {
                    foreach (var ent in entreprise.Publicites)
                    {
                        ent.Taxe_totale = ent.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface));
                        ent.Surface_totale = ent.Quantite * ent.Surface;
                    }
                }

                return entreprises;
                }
        }
    }
}

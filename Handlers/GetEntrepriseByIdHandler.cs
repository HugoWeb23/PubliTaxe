using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Services;
using System;

namespace Taxes.Handlers
{
    public class GetEntrepriseByIdHandler : IRequestHandler<GetEntrepriseById, Entreprise>
    {
        public Context _context;
        private readonly IMediator _mediator;

        public GetEntrepriseByIdHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<Entreprise> Handle(GetEntrepriseById request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises
                .AsNoTracking()
                .Include(ent => ent.Publicites)
                .ThenInclude(rue => rue.Rue)
                .ThenInclude(rue => rue.Code_postal)
                .Include(ent => ent.Code_postal)
                .ThenInclude(cp => cp.Pays)
                .Include(ent => ent.Publicites)
                .ThenInclude(pub => pub.Photos)
                .FirstOrDefault(ent => ent.Matricule_ciger == request.matricule);

            foreach(var ent in entreprise.Publicites)
            {
                ent.Taxe_totale = ent.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface));
                ent.Surface_totale = ent.Quantite * ent.Surface;
            }
               
            return entreprise;
        }
    }
}
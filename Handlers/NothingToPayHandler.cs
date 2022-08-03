using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.ViewModels;
using System;

namespace Taxes.Handlers
{
    public class NothingToPayHandler : IRequestHandler<NothingToPayListQuery, NothingToPayViewModel>
    {
        public Context _context;
        public readonly IMediator _mediator;

        public NothingToPayHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<NothingToPayViewModel> Handle(NothingToPayListQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises
                 .Include(ent => ent.Publicites)
                 .Where(ent => ent.Desactive == false)
                 .Where(ent => ent.Statut_paiement == 0)
                 .ToList();

            foreach (var ent in entreprises)
            {
                foreach (var pub in ent.Publicites)
                {
                    pub.Taxe_totale = pub.Exoneration ? new Decimal(0.00) : await _mediator.Send(new SumTaxQuery(pub.Exercice_courant, pub.Type_publicite, pub.Quantite, pub.Face, pub.Surface));
                }
            }

            entreprises = entreprises.Where(ent => ent.Publicites.Sum(p => p.Taxe_totale) == 0 && ent.Pourcentage_majoration == 0).ToList();

            int TotalElements = entreprises.Count();
            int TotalPages = (int)Math.Ceiling(TotalElements / (double)request.Filters.ElementsParPage);
            if (request.Filters.PageCourante > TotalPages)
            {
                request.Filters.PageCourante = TotalPages;
            }
            int Index = (request.Filters.PageCourante - 1) * request.Filters.ElementsParPage;
            entreprises = entreprises.Skip(Index).Take(request.Filters.ElementsParPage).ToList();

            return new NothingToPayViewModel
            {
                Entreprises = entreprises.Select(ent => new NothingToPayInfos
                {
                    Id_entreprise = ent.Id_entreprise,
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Recu = ent.Recu,
                    Nombre_panneaux = ent.Publicites.Count(),
                    Publicites = ent.Publicites.Select(pub => new NothingToPayAdvertisingView
                    {
                        Numero_panneau = pub.Numero_panneau,
                        Exoneration = pub.Exoneration,
                        Taxe_totale = pub.Taxe_totale
                    }).ToList()
                }).ToList(),
                TotalPages = TotalPages,
                PageCourante = request.Filters.PageCourante,
                ElementsParPage = request.Filters.ElementsParPage
            };
        }
    }
}

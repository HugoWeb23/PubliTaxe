using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Services;
using Taxes.ViewModels;
using System;

namespace Taxes.Handlers
{
    public class GetEntreprisesListHandler : IRequestHandler<GetEntreprisesQuery, EntreprisesViewModel>
    {
        public Context _context;

        public GetEntreprisesListHandler(Context context)
        {
            _context = context;
        }
        public Task<EntreprisesViewModel> Handle(GetEntreprisesQuery request, CancellationToken cancellationToken)
        {

            var predicate = PredicateBuilder.True<Entreprise>();

            if (request.Filters.Matricule != null)
            {
                predicate = predicate.And(ent => ent.Matricule_ciger == request.Filters.Matricule);
            }

            if (!string.IsNullOrEmpty(request.Filters.Nom))
            {
                predicate = predicate.And(ent => ent.Nom.Contains(request.Filters.Nom));
            }

            if (request.Filters.PubExoneration)
            {
                predicate = predicate.And(ent => ent.Publicites.Any(p => p.Exoneration == true));
            }

            if (request.Filters.Rue != null)
            {
                predicate = predicate.And(ent => ent.Publicites.Any(p => p.Id_rue == request.Filters.Rue));
            }

            if (request.Filters.ShowDelete == false)
            {
                predicate = predicate.And(ent => ent.Suppression == false);
            }

            if (request.Filters.ShowDisable == false)
            {
                predicate = predicate.And(ent => ent.Desactive == false);
            }

            List<Entreprise> entreprises = _context.entreprises
                .Include(ent => ent.Publicites)
                .Where(predicate)
                .ToList();

            if (request.Filters.PageCourante == 0) request.Filters.PageCourante = 1;
            if(request.Filters.ElementsParPage == 0) request.Filters.ElementsParPage = 15;


            int TotalEntreprises = _context.entreprises.Count();
            int TotalDesactives = _context.entreprises.Where(ent => ent.Desactive == true).Count();
            int TotalElements = entreprises.Count();
            int TotalRecus = _context.entreprises.Where(e => e.Recu == true).Count();
            int TotalPaiementsRecus = _context.entreprises.Where(e => e.Statut_paiement == 2).Count();
            int TotalInfractions = _context.entreprises.Where(e => e.Proces_verbal == true).Count();

            int TotalPages = (int)Math.Ceiling(TotalElements / (double)request.Filters.ElementsParPage);
            if(request.Filters.PageCourante > TotalPages)
            {
                request.Filters.PageCourante = TotalPages;
            }
            int Index = (request.Filters.PageCourante - 1) * request.Filters.ElementsParPage;

            entreprises = entreprises.Skip(Index).Take(request.Filters.ElementsParPage).ToList();

            return Task.FromResult(new EntreprisesViewModel
            {
                Entreprises = entreprises.Select(e => new EntrepriseInfos {  
                    Matricule_ciger = e.Matricule_ciger, 
                    Id_entreprise = e.Id_entreprise, 
                    Nom = e.Nom, 
                    Nombre_panneaux = e.Publicites.Count, 
                    Recu = e.Recu, 
                    Proces_verbal = e.Proces_verbal, 
                    Statut_paiement = e.Statut_paiement,
                    Suppression = e.Suppression
                }).ToList(),
                TotalPages = TotalPages,
                TotalRecus = TotalRecus,
                TotalPaiementsRecus = TotalPaiementsRecus,
                TotalEntreprises = TotalEntreprises,
                TotalDesactives = TotalDesactives,
                TotalInfractions = TotalInfractions,
                TotalElements = TotalElements,
                PageCourante = request.Filters.PageCourante,
                ElementsParPage = request.Filters.ElementsParPage
            });
        }
    }
}

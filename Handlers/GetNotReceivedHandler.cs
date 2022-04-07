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
    public class GetNotReceivedHandler : IRequestHandler<GetNotReceivedQuery, NotReceivedViewModel>
    {
        public Context _context;

        public GetNotReceivedHandler(Context context)
        {
            _context = context;
        }
        public Task<NotReceivedViewModel> Handle(GetNotReceivedQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises
                .Include(ent => ent.Publicites)
                 .Where(ent => ent.Recu == false)
                // Sélectionne les entreprises qui n'ont pas encore un non recu d'encodé
                .Where(ent => !_context.non_recus.Where(n => n.ExerciceId == request.Filters.FiscalYear).Select(n => n.Matricule_ciger).Contains(ent.Matricule_ciger))
                .ToList();

            int TotalElements = entreprises.Count();
            int TotalPages = (int)Math.Ceiling(TotalElements / (double)request.Filters.ElementsParPage);
            if (request.Filters.PageCourante > TotalPages)
            {
                request.Filters.PageCourante = TotalPages;
            }
            int Index = (request.Filters.PageCourante - 1) * request.Filters.ElementsParPage;
            entreprises = entreprises.Skip(Index).Take(request.Filters.ElementsParPage).ToList();

            return Task.FromResult(new NotReceivedViewModel
            {
                Entreprises = entreprises.Select(ent => new NotReceivedInfos
                {
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Nombre_panneaux = ent.Publicites.Count()
                }).ToList(),
                TotalPages = TotalPages,
                PageCourante = request.Filters.PageCourante,
                ElementsParPage = request.Filters.ElementsParPage
            });
        }
    }
}

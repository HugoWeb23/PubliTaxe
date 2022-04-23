using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Queries;
using Taxes.Entities;
using System.Collections.Generic;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class GetAllEntreprisesByDeletionRequestHandler : IRequestHandler<GetAllEntreprisesByDeletionRequestQuery, NotReceivedViewModel>
    {
        private Context _context;
        public GetAllEntreprisesByDeletionRequestHandler(Context context)
        {
            _context = context;
        }

        public Task<NotReceivedViewModel> Handle(GetAllEntreprisesByDeletionRequestQuery request, CancellationToken cancellationToken)
        {
            List<Entreprise> entreprises = _context.entreprises
                .AsNoTracking()
                .Include(ent => ent.Publicites)
                .Where(ent => ent.Suppression == true)
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
                    Id_entreprise = ent.Id_entreprise,
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
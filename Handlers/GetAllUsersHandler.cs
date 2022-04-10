using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserWithoutPassViewModel>>
    {
        public Context _context;

        public GetAllUsersHandler(Context context)
        {
            _context = context;
        }
        public Task<List<UserWithoutPassViewModel>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            List<Utilisateur> data = new List<Utilisateur>();
            if(request.Filters.Text.Length == 0)
            {
                data = _context.utilisateurs.ToList();
            }
            if (request.Filters.Text.Length > 0 && request.Filters.Type == "1")
            {
                data = _context.utilisateurs
               .Where(u => u.Nom.Contains(request.Filters.Text))
               .ToList();
            } else if (request.Filters.Text.Length > 0 && request.Filters.Type == "2")
            {
                data = _context.utilisateurs
               .Where(u => u.Prenom.Contains(request.Filters.Text))
               .ToList();
            } else if (request.Filters.Text.Length > 0 && request.Filters.Type == "3")
            {
                data = _context.utilisateurs
               .Where(u => u.Mail.Contains(request.Filters.Text))
               .ToList();
            }

            List<UserWithoutPassViewModel> Users = data.Select(user => new UserWithoutPassViewModel
            {
                Id = user.Id,
                Nom = user.Nom,
                Prenom = user.Prenom,
                Mail = user.Mail,
                Actif = user.Actif,
                Role = user.Role,
                Changement_pass = user.Changement_pass
            }).ToList();


            return Task.FromResult(Users);
        }
    }
}

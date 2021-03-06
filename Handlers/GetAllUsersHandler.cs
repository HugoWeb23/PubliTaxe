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
            List<UserWithoutPassViewModel> Utilisateurs = _context.utilisateurs
                .Select(user => new UserWithoutPassViewModel
                {
                    Id = user.Id,
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Mail = user.Mail,
                    Actif = user.Actif,
                    Role = user.Role,
                    Changement_pass = user.Changement_pass
                })
                .ToList();

            return Task.FromResult(Utilisateurs);
        }
    }
}

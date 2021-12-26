using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserWithoutPassViewModel>
    {
        public Context _context;

        public GetUserByIdHandler(Context context)
        {
            _context = context;
        }
        public Task<UserWithoutPassViewModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            Utilisateur User = _context.utilisateurs
                .AsNoTracking()
                .FirstOrDefault(user => user.Id == request.Id);

            return Task.FromResult(new UserWithoutPassViewModel
            {
                Id = User.Id,
                Nom = User.Nom,
                Prenom = User.Prenom,
                Mail = User.Mail,
                Actif = User.Actif,
                Role = User.Role,
                Changement_pass = User.Changement_pass
            });
        }
    }
}

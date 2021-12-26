using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using Taxes.ViewModels;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Taxes.Handlers
{
    public class NewUserHandler : IRequestHandler<NewUserCommand, UserWithoutPassViewModel>
    {
        private Context _context;
        public NewUserHandler(Context context)
        {
            _context = context;
        }

        public Task<UserWithoutPassViewModel> Handle(NewUserCommand request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.SingleOrDefault(user => user.Mail == request.User.Mail);
            if(CheckUser != null)
            {
                throw new Exception("Cette adresse e-mail est déjà utilisée");
            }

            request.User.Pass = BCryptNet.HashPassword(request.User.Pass);
            request.User.Actif = 0;
            request.User.Role = 1;

            _context.utilisateurs.Add(request.User);
            _context.SaveChanges();

            return Task.FromResult(new UserWithoutPassViewModel
            {
                Id = request.User.Id,
                Nom = request.User.Nom,
                Prenom = request.User.Prenom,
                Mail = request.User.Mail,
                Actif = request.User.Actif,
                Role = request.User.Role,
                Changement_pass = request.User.Changement_pass
            });

        }
    }
}

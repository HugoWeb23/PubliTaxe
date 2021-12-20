using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Taxes.Handlers
{
    public class NewUserHandler : IRequestHandler<NewUserCommand, Utilisateur>
    {
        private Context _context;
        public NewUserHandler(Context context)
        {
            _context = context;
        }

        public Task<Utilisateur> Handle(NewUserCommand request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.SingleOrDefault(user => user.Mail == request.User.Mail);
            if(CheckUser != null)
            {
                throw new Exception("Cette adresse e-mail est déjà utilisée");
            }

            request.User.Pass = BCryptNet.HashPassword(request.User.Pass);
            request.User.Actif = false;

            _context.utilisateurs.Add(request.User);
            _context.SaveChanges();

            return Task.FromResult(request.User);

        }
    }
}

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
    public class LoginHandler : IRequestHandler<LoginQuery, Utilisateur>
    {
        private Context _context;
        public LoginHandler(Context context)
        {
            _context = context;
        }

        public Task<Utilisateur> Handle(LoginQuery request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.SingleOrDefault(user => user.Mail == request.User.Mail);
            if (CheckUser == null || !BCryptNet.Verify(request.User.Pass, CheckUser.Pass))
            {
                throw new Exception("Adresse e-mail ou mot de passe incorrect");
            }

            return Task.FromResult(CheckUser);

        }
    }
}

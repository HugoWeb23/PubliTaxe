using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Queries;
using Taxes.Entities;
using BCryptNet = BCrypt.Net.BCrypt;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class LoginHandler : IRequestHandler<LoginQuery, UserLoginViewModel>
    {
        private Context _context;
        private IMediator _mediator;
        public LoginHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<UserLoginViewModel> Handle(LoginQuery request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.SingleOrDefault(user => user.Mail == request.User.Mail);
            if (CheckUser == null || !BCryptNet.Verify(request.User.Pass, CheckUser.Pass))
            {
                throw new Exception("Adresse e-mail ou mot de passe incorrect");
            }

            UserLoginViewModel userLoginViewModel = new UserLoginViewModel
            {
                Id = CheckUser.Id,
                Nom = CheckUser.Nom,
                Prenom = CheckUser.Prenom,
                Mail = CheckUser.Mail,
                Actif = CheckUser.Actif,
                Token = await _mediator.Send(new GenerateJwtTokenQuery(CheckUser))
            };

            return userLoginViewModel;

        }
    }
}

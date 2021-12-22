using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using System.Collections.Generic;
using Taxes.Queries;
using System.Linq;
using System;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Taxes.Handlers
{
    public class ChangePasswordHander : IRequestHandler<ChangePasswordCommand, bool>
    {
        private Context _context;
        private IMediator _mediator;
        public ChangePasswordHander(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            Utilisateur User = _context.utilisateurs.FirstOrDefault(u => u.Id == request.Data.UserID);
            if (User == null)
            {
                throw new Exception("L'utilisateur n'existe pas");
            }
            if (BCryptNet.Verify(request.Data.Currentpassword, User.Pass) == false)
            {
                throw new Exception("Le mot de passe actuel est incorrect");
            }
            User.Pass = BCryptNet.HashPassword(request.Data.Newpassword);
            User.Changement_pass = 0;

            _context.SaveChanges();
            return true;
        }
    }
}
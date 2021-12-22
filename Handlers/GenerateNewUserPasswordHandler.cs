using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Commands;
using Taxes.Services;
using BCryptNet = BCrypt.Net.BCrypt;
using System;

namespace Taxes.Handlers
{
    public class GenerateNewUserPasswordHandler : IRequestHandler<GenerateNewUserPasswordCommand, string>
    {
        public Context _context;

        public GenerateNewUserPasswordHandler(Context context)
        {
            _context = context;
        }
        public Task<string> Handle(GenerateNewUserPasswordCommand request, CancellationToken cancellationToken)
        {
            string NewPassword = RandomPassword.GenerateRandomPassword();

            Utilisateur UserExist = _context.utilisateurs.AsNoTracking().FirstOrDefault(u => u.Id == request.UserID);

            if(UserExist == null)
            {
                throw new Exception("L'utilisateur n'existe pas");
            }

            Utilisateur utilisateur = new Utilisateur
            {
                Id = request.UserID,
                Pass = BCryptNet.HashPassword(NewPassword),
                Changement_pass = 1
            };

            _context.utilisateurs.Attach(utilisateur);
            _context.Entry(utilisateur).Property(u => u.Pass).IsModified = true;
            _context.Entry(utilisateur).Property(u => u.Changement_pass).IsModified = true;
            _context.SaveChanges();

            return Task.FromResult(NewPassword);
        }
    }
}

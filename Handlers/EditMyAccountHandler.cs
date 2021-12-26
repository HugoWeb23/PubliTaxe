using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Commands;
using Taxes.ViewModels;
using System;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Taxes.Handlers
{
    public class EditMyAccountHandler : IRequestHandler<EditMyAccountCommand, UserWithoutPassViewModel>
    {
        public Context _context;

        public EditMyAccountHandler(Context context)
        {
            _context = context;
        }
        public Task<UserWithoutPassViewModel> Handle(EditMyAccountCommand request, CancellationToken cancellationToken)
        {
            Utilisateur User = _context.utilisateurs
                .AsNoTracking()
                .FirstOrDefault(user => user.Id == request.User.Id);

            if(request.User.Mail != User.Mail)
            {
                Utilisateur CheckMailIsAvailable = _context.utilisateurs
                    .Where(u => u.Mail == request.User.Mail)
                    .FirstOrDefault();

                if (CheckMailIsAvailable != null)
                    throw new Exception("L'adresse e-mail est déjà utilisée");
            }

            _context.Entry(request.User).State = EntityState.Modified;

            if (string.IsNullOrEmpty(request.User.Pass))
            {
                _context.Entry(request.User).Property(u => u.Pass).IsModified = false;
                _context.Entry(request.User).Property(u => u.Actif).IsModified = false;
                _context.Entry(request.User).Property(u => u.Role).IsModified = false;
                _context.Entry(request.User).Property(u => u.Changement_pass).IsModified = false;
            } else
            {
                request.User.Pass = BCryptNet.HashPassword(request.User.Pass);
            }

            _context.SaveChanges();

            return Task.FromResult(new UserWithoutPassViewModel
            {
                Id = User.Id,
                Nom = request.User.Nom,
                Prenom = request.User.Prenom,
                Mail = request.User.Mail,
                Actif =User.Actif,
                Role =User.Role,
                Changement_pass = User.Changement_pass
            });
        }
    }
}

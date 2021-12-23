using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private Context _context;
        public DeleteUserHandler(Context context)
        {
            _context = context;
        }

        public Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.AsNoTracking().SingleOrDefault(user => user.Id == request.UserID);
            if (CheckUser == null)
            {
                throw new Exception("L'utilisateur n'existe pas");
            }

            _context.utilisateurs.Remove(CheckUser);
            _context.SaveChanges();

            return Task.FromResult(true);

        }
    }
}

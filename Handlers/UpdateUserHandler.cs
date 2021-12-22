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
    public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Utilisateur>
    {
        private Context _context;
        public UpdateUserHandler(Context context)
        {
            _context = context;
        }

        public Task<Utilisateur> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            Utilisateur CheckUser = _context.utilisateurs.AsNoTracking().SingleOrDefault(user => user.Id == request.User.Id);
            if (CheckUser == null)
            {
                throw new Exception("L'utilisateur n'existe pas");
            }

            request.User.Pass = CheckUser.Pass;

            _context.utilisateurs.Update(request.User);
            _context.SaveChanges();

            return Task.FromResult(request.User);

        }
    }
}

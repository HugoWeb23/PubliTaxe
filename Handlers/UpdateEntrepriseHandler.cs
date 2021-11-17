using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class UpdateEntrepriseHandler : IRequestHandler<UpdateEntrepriseCommand, Entreprise>
    {
        private Context _context;
        public UpdateEntrepriseHandler(Context context)
        {
            _context = context;
        }

        public Task<Entreprise> Handle(UpdateEntrepriseCommand request, CancellationToken cancellationToken)
        {
            _context.entreprises.Update(request.Entreprise);
            _context.SaveChanges();
            return Task.FromResult(request.Entreprise);
        }
    }
}

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class UpdatePubliciteHandler : IRequestHandler<UpdatePubliciteCommand, Publicite>
    {
        private Context _context;
        public UpdatePubliciteHandler(Context context)
        {
            _context = context;
        }

        public Task<Publicite> Handle(UpdatePubliciteCommand request, CancellationToken cancellationToken)
        {
            _context.Entry(request.Publicite).State = EntityState.Modified;
            _context.enseignes_publicitaires.Update(request.Publicite);
            _context.SaveChanges();

            return Task.FromResult(request.Publicite);
        }
    }
}

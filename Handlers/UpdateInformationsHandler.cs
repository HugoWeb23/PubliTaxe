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
    public class UpdateInformationsHandler : IRequestHandler<UpdateInformationsCommand, Information>
    {
        private Context _context;
        public UpdateInformationsHandler(Context context)
        {
            _context = context;
        }

        public Task<Information> Handle(UpdateInformationsCommand request, CancellationToken cancellationToken)
        {
            _context.informations.Update(request.Informations);
            _context.SaveChanges();

            return Task.FromResult(request.Informations);

        }
    }
}

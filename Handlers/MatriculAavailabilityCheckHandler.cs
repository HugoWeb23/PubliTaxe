using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

namespace Taxes.Handlers
{
    public class MatriculAavailabilityCheckHandler : IRequestHandler<MatriculAavailabilityCheckQuery, bool>
    {
        public Context _context;

        public MatriculAavailabilityCheckHandler(Context context)
        {
            _context = context;
        }
        public Task<bool> Handle(MatriculAavailabilityCheckQuery request, CancellationToken cancellationToken)
        {
            return Task.FromResult(!_context.entreprises.Any(ent => ent.Matricule_ciger == request.Matricule));
        }
    }
}

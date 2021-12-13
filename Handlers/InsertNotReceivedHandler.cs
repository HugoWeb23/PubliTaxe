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
    public class InsertNotReceivedHandler : IRequestHandler<InsertNotReceivedCommand, NotReceived>
    {
        private Context _context;
        public InsertNotReceivedHandler(Context context)
        {
            _context = context;
        }

        public Task<NotReceived> Handle(InsertNotReceivedCommand request, CancellationToken cancellationToken)
        {
            request.NotReceived.Date = DateTime.Now.ToString("dd/MM/yyyy");
            NotReceived notReceived = _context.non_recus
                .Where(nr => nr.Matricule_ciger == request.NotReceived.Matricule_ciger && nr.ExerciceId == request.NotReceived.ExerciceId)
                .FirstOrDefault();

            _context.non_recus.Add(request.NotReceived);
            _context.SaveChanges();
            return Task.FromResult(request.NotReceived);
        }
    }
}
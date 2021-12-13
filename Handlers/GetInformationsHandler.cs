using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Taxes.Handlers
{
    public class GetInformationsHandler : IRequestHandler<GetInformationsQuery, object>
    {
        public Context _context;

        public GetInformationsHandler(Context context)
        {
            _context = context;
        }
        public Task<object> Handle(GetInformationsQuery request, CancellationToken cancellationToken)
        {
            var Informations = _context.informations
                .Join(_context.exercices, info => info.Exercice_courant, ex => ex.Id, (info, ex) => new 
                { 
                    Id = info.Id, 
                    Personne_contact = info.Personne_de_contact, 
                    Telephone_contact = info.Telephone_contact, 
                    Mail_contact = info.Mail_contact,
                    Exercice = ex.Annee_exercice
                }).FirstOrDefault();
            return Task.FromResult((object)Informations);
        }
    }
}
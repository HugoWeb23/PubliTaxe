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
    public class GetInformationsHandler : IRequestHandler<GetInformationsQuery, Information>
    {
        public Context _context;

        public GetInformationsHandler(Context context)
        {
            _context = context;
        }
        public Task<Information> Handle(GetInformationsQuery request, CancellationToken cancellationToken)
        {
            Information Informations = _context.informations
                .AsNoTracking()
                .Join(_context.exercices, info => info.Exercice_courant, ex => ex.Id, (info, ex) => new Information 
                { 
                    Id = info.Id, 
                    Personne_contact = info.Personne_contact, 
                    Telephone_contact = info.Telephone_contact, 
                    Mail_contact = info.Mail_contact,
                    Exercice_courant = info.Exercice_courant,
                    Bourgmestre = info.Bourgmestre,
                    Direction_generale = info.Direction_generale,
                    Exercice = ex.Annee_exercice
                })
                .FirstOrDefault();
            return Task.FromResult(Informations);
        }
    }
}
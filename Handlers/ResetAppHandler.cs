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
    public class ResetAppHandler : IRequestHandler<ResetAppCommand, bool>
    {
        private Context _context;
        public ResetAppHandler(Context context)
        {
            _context = context;
        }

        public Task<bool> Handle(ResetAppCommand request, CancellationToken cancellationToken)
        {
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.non_recus WHERE exerciceId = 7");
            _context.Database.ExecuteSqlRaw("UPDATE dbo.enseignes_publicitaires SET exercice_courant = 7");
            _context.Database.ExecuteSqlRaw("UPDATE dbo.informations SET exercice_courant = 7");
            _context.Database.ExecuteSqlRaw("UPDATE dbo.entreprises SET recu = 0, suppression = 0, statut_paiement = 0, proces_verbal = 0, pourcentage_majoration = 0, motif_majorationId = null");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.paiements_recus");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.tarifs WHERE exerciceId > 7");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.exercices WHERE id > 7");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.utilisateurs WHERE id > 30004");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.entreprises WHERE id_entreprise >= 20017");
            _context.Database.ExecuteSqlRaw("DELETE FROM dbo.simulations WHERE id_simulation NOT IN (7, 10006, 30007)");
            return Task.FromResult(true);
        }
    }
}
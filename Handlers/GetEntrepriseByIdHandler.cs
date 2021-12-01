using Taxes.Entities;
using MediatR;
using System.Collections.Generic;
using Taxes.Queries;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Services;

namespace Taxes.Handlers
{
    public class GetEntrepriseByIdHandler : IRequestHandler<GetEntrepriseById, Entreprise>
    {
        public Context _context;
        private readonly IMediator _mediator;

        public GetEntrepriseByIdHandler(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }
        public async Task<Entreprise> Handle(GetEntrepriseById request, CancellationToken cancellationToken)
        {
            Entreprise entreprise = _context.entreprises
                .AsNoTracking()
                .Include(ent => ent.Publicites)
                .ThenInclude(rue => rue.Rue)
                .ThenInclude(rue => rue.Code_postal)
                .Include(ent => ent.Code_postal)
                .ThenInclude(cp => cp.Pays)
                .Include(ent => ent.Publicites)
                .ThenInclude(pub => pub.Photos)
                .FirstOrDefault(ent => ent.Matricule_ciger == request.matricule);

            

            foreach(var ent in entreprise.Publicites)
            {
                ent.Taxe_totale = await SumTax(ent.Exercice_courant, ent.Type_publicite, ent.Quantite, ent.Face, ent.Surface);
                ent.Surface_totale = ent.Quantite * ent.Surface;
            }
               
            return entreprise;
        }

        public async Task<decimal> SumTax(short exercice, short Type_publicite, short Quantite, short Face, decimal Surface)
        {
            Dictionary<int, string> PricesNames = new Dictionary<int, string>()
            {
            {1, "prix_unitaire_enseigne_non_lumineuse" },
            {2, "prix_unitaire_enseigne_lumineuse" },
            {3,"prix_unitaire_enseigne_clignotante" },
            {4, "prix_unitaire_panneau_non_lumineux" },
            {5, "prix_unitaire_panneau_lumineux" },
            {6, "prix_unitaire_panneau_a_defilement" }
            };
            List<Tarif> tarifs = await _mediator.Send(new GetAllPricesQuery());

            string data = PricesNames.FirstOrDefault(price => price.Key == Type_publicite).Value;
            decimal price = 0;
            if(data != null)
            {
                price = tarifs.First(p => p.Exercice == exercice).Prix_unitaire_panneau_a_defilement;
            }
            decimal sum = price * Surface * Quantite * Face;
            Test test = new Test { Id = 5, Nom = "test", Code_postal = 7700, Prenom = "lol" };
            object propValue = test.GetType().GetProperty("Nom").GetValue(test);
            return decimal.Round(sum, 2, System.MidpointRounding.AwayFromZero);
        }
    }
}
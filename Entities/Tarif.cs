using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Tarif
    {
        public int exercice { get; set; }
        public decimal prix_unitaire_enseigne_non_lumineuse { get; set; }
        public decimal prix_unitaire_enseigne_lumineuse { get; set; }
        public decimal prix_unitaire_enseigne_clignotante { get; set; }
        public decimal prix_unitaire_panneau_non_lumineux { get; set; }
        public decimal prix_unitaire_panneau_lumineux { get; set; }
        public decimal prix_unitaire_panneau_a_defilement { get; set; }

    }
}

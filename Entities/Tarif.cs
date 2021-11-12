using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Tarif
    {
        [Key]
        public int Exercice { get; set; }
        public decimal Prix_unitaire_enseigne_non_lumineuse { get; set; }
        public decimal Prix_unitaire_enseigne_lumineuse { get; set; }
        public decimal Prix_unitaire_enseigne_clignotante { get; set; }
        public decimal Prix_unitaire_panneau_non_lumineux { get; set; }
        public decimal Prix_unitaire_panneau_lumineux { get; set; }
        public decimal Prix_unitaire_panneau_a_defilement { get; set; }

    }
}

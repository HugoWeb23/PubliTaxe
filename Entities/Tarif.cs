using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Tarif
    {
        [Key]
        public int Exercice { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_non_lumineuse { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_lumineuse { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_clignotante { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_non_lumineux { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_lumineux { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_a_defilement { get; set; }

    }
}

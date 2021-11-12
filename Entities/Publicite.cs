using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Publicite
    {
        [Key]
        public decimal Numero_panneau { get; set; }
        public decimal Matricule_ciger { get; set; }
        public decimal Numero_rue { get; set; }
        public int Exercice_courant { get; set; }
        public int Type_publicite { get; set; }
        public string Adresse_numero_pub { get; set; }
        public string Situation { get; set; }
        public int Quantite { get; set; }
        public int Face { get; set; }
        public string Mesure { get; set; }
        public decimal Surface { get; set; }
        public int Code_recu { get; set; }
        public int Exoneration { get; set; }
        public int Pv { get; set; }

    }
}

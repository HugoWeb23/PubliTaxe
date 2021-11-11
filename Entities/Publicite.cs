using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Publicite
    {
        public decimal numero_panneau { get; set; }
        public decimal matricule_ciger { get; set; }
        public decimal numero_rue { get; set; }
        public int exercice_courant { get; set; }
        public int type_publicite { get; set; }
        public string adresse_numero_pub { get; set; }
        public string situation { get; set; }
        public int quantite { get; set; }
        public int face { get; set; }
        public string mesure { get; set; }
        public decimal surface { get; set; }
        public int code_recu { get; set; }
        public int exoneration { get; set; }
        public int pv { get; set; }

    }
}

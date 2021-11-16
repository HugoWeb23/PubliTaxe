using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Publicite
    {
        [Key]
        public long Numero_panneau { get; set; }
        public long Matricule_ciger { get; set; }
        public int Id_rue { get; set; }
        public short Exercice_courant { get; set; }
        public short Type_publicite { get; set; }
        public string Adresse_numero { get; set; }
        public string Situation { get; set; }
        public short Quantite { get; set; }
        public short Face { get; set; }
        public string Mesure { get; set; }
        [Column(TypeName = "decimal(9,2)")]
        public decimal Surface { get; set; }
        public short Code_recu { get; set; }
        public short Exoneration { get; set; }
        public short Pv { get; set; }

    }
}

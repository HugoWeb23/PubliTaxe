using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Rue
    {
        [Key]
        [Column("id_rue")]
        public int Id_rue { get; set; }
        public int Code_postal {get; set; }
        public int Numero_rue {get; set; }
        public string Langue {get; set; }
        public string Nom_rue {get; set; }

    }
}

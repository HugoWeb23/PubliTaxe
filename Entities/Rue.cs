using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Rue
    {
        public int Code_postal {get; set; }
        [Key]
        public int Numero_rue {get; set; }
        public string Langue {get; set; }
        public string Nom_rue {get; set; }

    }
}

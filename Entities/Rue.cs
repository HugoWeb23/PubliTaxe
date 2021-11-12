using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Rue
    {
        public decimal Code_postal {get; set; }
        [Key]
        public decimal Numero_rue {get; set; }
        public string Langue {get; set; }
        public string Nom_rue {get; set; }

    }
}

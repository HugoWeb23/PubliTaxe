using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Rue
    {
        public decimal code_postal {get; set; }
        public decimal numero_rue {get; set; }
        public string langue {get; set; }
        public string nom_rue {get; set; }

    }
}

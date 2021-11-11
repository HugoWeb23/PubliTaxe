using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Exercice
    {
        public int anee_exercice { get; set; }
        public DateTime date_echeance { get; set; }
        public DateTime date_reglement_taxe { get; set; }

    }
}

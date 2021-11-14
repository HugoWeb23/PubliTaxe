using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Exercice
    {
        [Key]
        public short Anee_exercice { get; set; }
        public DateTime Date_echeance { get; set; }
        public DateTime Date_reglement_taxe { get; set; }

    }
}

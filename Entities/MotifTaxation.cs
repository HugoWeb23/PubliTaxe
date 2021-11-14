using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class MotifTaxation
    {
        [Key]
        public int Id_motif { get; set; }
        public string Libelle { get; set; }

    }
}

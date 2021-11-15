using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class MotifMajoration
    {
        [Key]
        public int Id_motif { get; set; }
        public string Libelle { get; set; }

    }
}

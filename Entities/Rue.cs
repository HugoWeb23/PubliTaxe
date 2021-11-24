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
        public int RueId { get; set; }
        [ForeignKey("Code_postal")]
        public int Code_postalId {get; set; }
        public string Code_rue {get; set; }
        public string Langue {get; set; }
        public string Nom_rue {get; set; }
        public Code_postal Code_postal { get; set; }

    }
}

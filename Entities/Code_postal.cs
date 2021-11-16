using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Code_postal
    {
        [Key]
        public int Code_postalId { get; set; }
        public int Numero_localite { get; set; }
        public int Code_pays { get; set; }
        [Column("code_postal")]
        public int CP { get; set; }
        public string Localite { get; set; }
        public string Pays { get; set; }

    }
}

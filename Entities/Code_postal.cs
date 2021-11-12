using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Code_postal
    {
        [Key]
        public int Numero_localite { get; set; }
        public int Code_pays { get; set; }
        public int CP { get; set; }
        public string Localite { get; set; }
        public string Pays { get; set; }

    }
}

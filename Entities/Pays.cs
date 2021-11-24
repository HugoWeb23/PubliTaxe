using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Taxes.Entities
{
    public class Pays
    {
         [Key]
        public int PaysId { get; set; }
        public string Code_pays { get; set; }
        public string Nom_pays { get; set; }
    }
}

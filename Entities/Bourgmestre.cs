using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Bourgmestre
    {
        [Key]
        public int Id { get; set; }
        public string Nom_bourgmestre { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Information
    {
        [Key]
        public int Id { get; set; }
        public string Personne_de_contact { get; set; }
        public string Telephone_contact { get; set; }
        public string Mail_contact { get; set; }
        public long Exercice_courant { get; set; }

    }
}

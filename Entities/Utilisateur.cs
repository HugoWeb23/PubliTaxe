using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Taxes.Entities
{
    public class Utilisateur
    {
        [Key]
        public long Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Mail { get; set; }
        [JsonIgnore]
        public string Pass { get; set; }
        public short Actif { get; set; }
        public short Role { get; set; }
        public short Changement_pass { get; set; }
    }
}

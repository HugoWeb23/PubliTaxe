using System.ComponentModel.DataAnnotations;
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
        public bool Actif { get; set; }
    }
}

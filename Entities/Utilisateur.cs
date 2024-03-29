﻿using System.ComponentModel.DataAnnotations;

namespace Taxes.Entities
{
    public class Utilisateur
    {
        [Key]
        public long Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Mail { get; set; }
        public string Pass { get; set; }
        public short Actif { get; set; }
        public short Role { get; set; }
        public short Changement_pass { get; set; }
    }
}

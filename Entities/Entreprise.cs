using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Entreprise
    {
        public decimal matricule_ciger { get; set; }
        public int numero_localite { get; set; }
        public string nom { get; set; }
        public decimal code_rue { get; set; }
        public string adresse_rue { get; set; }
        public string adresse_numero { get; set; } 
        public decimal adresse_boite { get; set; }
        public string adresse_index { get; set; }
        public string numero_telephone { get; set; }
        public string numero_fax { get; set; }
        public string numero_tva { get; set; }
        public int recu { get; set; }
        public int province { get; set; }
        public string personne_contact { get; set; }
        public string telephone_contact { get; set; }
        public string mail_contact { get; set; }
        public int pourcentage_majoration { get; set; }
        public int motif_majoration { get; set; }
        public decimal code_rue_taxation { get; set; }
        public string adresse_taxation { get; set; }
        public string adresse_numero_taxation { get; set; }
        public string adresse_boite_taxation { get; set; }
        public string adresse_index_taxation { get; set; }
        public decimal adresse_code_postal_taxation { get; set; }
        public string adresse_localite_taxation { get; set; }
        public string commentaire_taxation { get; set; }
        public int role_linguistique { get; set; }

    }
}

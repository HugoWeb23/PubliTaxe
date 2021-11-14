using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Entreprise
    {
        [Key]
        public long Matricule_ciger { get; set; }
        public int Numero_localite { get; set; }
        public string Nom { get; set; }
        public int Code_rue { get; set; }
        public string Adresse_rue { get; set; }
        public string Adresse_numero { get; set; }
        public int Adresse_boite { get; set; }
        public string Adresse_index { get; set; }
        public string Numero_telephone { get; set; }
        public string Numero_fax { get; set; }
        public string Numero_tva { get; set; }
        public int Recu { get; set; }
        public int Province { get; set; }
        public string Personne_contact { get; set; }
        public string Telephone_contact { get; set; }
        public string Mail_contact { get; set; }
        public int Pourcentage_majoration { get; set; }
        public int Motif_majoration { get; set; }
        public int Code_rue_taxation { get; set; }
        public string Adresse_taxation { get; set; }
        public int Adresse_numero_taxation { get; set; }
        public int Adresse_boite_taxation { get; set; }
        public string Adresse_index_taxation { get; set; }
        public int Adresse_code_postal_taxation { get; set; }
        public string Adresse_localite_taxation { get; set; }
        public string Commentaire_taxation { get; set; }
        public int Role_linguistique { get; set; }

    }
}

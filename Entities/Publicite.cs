using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Publicite
    {

        public bool Equals(Publicite other)
        {
            if (other is null)
                return false;

            return this.Numero_panneau == other.Numero_panneau &&
                   this.Matricule_ciger == other.Matricule_ciger &&
                   this.Id_rue == other.Id_rue &&
                   this.Exercice_courant == other.Exercice_courant &&
                   this.Type_publicite == other.Type_publicite &&
                   this.Adresse_numero == other.Adresse_numero &&
                   this.Situation == other.Situation &&
                   this.Quantite == other.Quantite &&
                   this.Face == other.Face &&
                   this.Mesure == other.Mesure &&
                   this.Surface == other.Surface &&
                   this.Surface_totale == other.Surface_totale &&
                   this.Taxe_totale == other.Taxe_totale &&
                   this.Code_recu == other.Code_recu &&
                   this.Exoneration == other.Exoneration &&
                   this.Pv == other.Pv &&
                   this.Entreprise == other.Entreprise &&
                   this.Rue == other.Rue;
        }

        public override bool Equals(object obj) => Equals(obj as Publicite);
        public override int GetHashCode() => (Numero_panneau,
                                              Matricule_ciger,
                                              Id_rue,
                                              Exercice_courant,
                                              Type_publicite,
                                              Adresse_numero,
                                              Situation,
                                              Quantite,
                                              Face,
                                              Mesure,
                                              Surface,
                                              Surface_totale,
                                              Taxe_totale,
                                              Code_recu,
                                              Exoneration,
                                              Pv,
                                              Entreprise,
                                              Rue)
                                              .GetHashCode();

        [Key]
        public long Numero_panneau { get; set; }
        public long Matricule_ciger { get; set; }
        [ForeignKey("Rue")]
        public int Id_rue { get; set; }
        public short Exercice_courant { get; set; }
        public short Type_publicite { get; set; }
        public string Adresse_numero { get; set; }
        public string Situation { get; set; }
        public short Quantite { get; set; }
        public short Face { get; set; }
        public string Mesure { get; set; }
        [Column(TypeName = "decimal(9,2)")]
        public decimal Surface { get; set; }
        [NotMapped]
        public decimal Surface_totale { get; set; }
        [NotMapped]
        public decimal Taxe_totale { get; set; }
        public short Code_recu { get; set; }
        public bool Exoneration { get; set; }
        public short Pv { get; set; }
        [ForeignKey("Matricule_ciger")]
        public Entreprise Entreprise { get; set; }
        public Rue Rue { get; set; }
        public ICollection<PublicitesPhotos> Photos { get; set; }

    }
}

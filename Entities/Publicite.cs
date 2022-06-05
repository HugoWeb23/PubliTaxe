using Newtonsoft.Json;
using FluentValidation;
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

            return this.Numero_panneau == other.Numero_panneau;    
        }

        public override bool Equals(object obj) => Equals(obj as Publicite);
        public override int GetHashCode() => (Numero_panneau).GetHashCode();

        [Key]
        public long Numero_panneau { get; set; }
        public long Id_entreprise { get; set; }
        [ForeignKey("Rue")]
        public int Id_rue { get; set; }
        public long Exercice_courant { get; set; }
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
        [ForeignKey("Id_entreprise")]
        public Entreprise Entreprise { get; set; }
        public Rue Rue { get; set; }
        public ICollection<PublicitesPhotos> Photos { get; set; }

    }

    public class PubliciteValidator : AbstractValidator<Publicite>
    {
        public PubliciteValidator()
        {
            RuleFor(pub => pub.Id_rue).NotEmpty().WithMessage("Veuillez saisir un ID de rue");
            RuleFor(pub => pub.Exercice_courant).NotEmpty().WithMessage("Veuillez renseigner l'année de l'exercice");
            RuleFor(pub => pub.Type_publicite).NotEmpty().WithMessage("Veuillez saisir le type de la publicité");
            RuleFor(pub => pub.Adresse_numero).NotEmpty().WithMessage("Veuillez le numéro de l'adresse");
            RuleFor(pub => pub.Numero_panneau).NotNull().WithMessage("Veuillez saisir une situation");
            RuleFor(pub => pub.Quantite).NotEmpty().WithMessage("Veuillez saisir une quantité");
            RuleFor(pub => pub.Face).NotEmpty().WithMessage("Veuillez saisir une type de face");
            RuleFor(pub => pub.Mesure).NotEmpty().WithMessage("Veuillez saisir les mesures du panneau");
            RuleFor(pub => pub.Surface).NotEmpty().WithMessage("Veuillez saisir la surface du panneau");
            RuleFor(pub => pub.Exoneration).NotNull().WithMessage("Veuillez préciser si le panneau bénéficie d'une exonération");
        }
    }
}

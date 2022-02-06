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
    public class PubliciteSimulation
    {

        public bool Equals(PubliciteSimulation other)
        {
            if (other is null)
                return false;

            return this.Id == other.Id &&
                   this.Id_simulation == other.Id_simulation &&
                   this.Simulation == other.Simulation &&
                   this.Id_rue == other.Id_rue &&
                   this.Type_publicite == other.Type_publicite &&
                   this.Adresse_numero == other.Adresse_numero &&
                   this.Situation == other.Situation &&
                   this.Quantite == other.Quantite &&
                   this.Face == other.Face &&
                   this.Mesure == other.Mesure &&
                   this.Surface == other.Surface &&
                   this.Surface_totale == other.Surface_totale &&
                   this.Exoneration == other.Exoneration &&
                   this.Rue == other.Rue;
        }

        public override bool Equals(object obj) => Equals(obj as PubliciteSimulation);
        public override int GetHashCode() => (Id,
                                              Id_simulation,  
                                              Id_rue,
                                              Type_publicite,
                                              Adresse_numero,
                                              Situation,
                                              Quantite,
                                              Face,
                                              Mesure,
                                              Surface,
                                              Surface_totale,
                                              Exoneration,
                                              Simulation,
                                              Rue)
                                              .GetHashCode();

        [Key]
        public long Id { get; set; }
        public long Id_simulation { get; set; }
        [ForeignKey("Rue")]
        public int Id_rue { get; set; }
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
        public bool Exoneration { get; set; }
        [ForeignKey("Id_simulation")]
        public Simulation Simulation { get; set; }
        public Rue Rue { get; set; }

    }

    public class PubliciteSimulationValidator : AbstractValidator<PubliciteSimulation>
    {
        public PubliciteSimulationValidator()
        {
            RuleFor(pub => pub.Id_rue).NotEmpty().WithMessage("Veuillez saisir un ID de rue");
            RuleFor(pub => pub.Type_publicite).NotEmpty().WithMessage("Veuillez saisir le type de la publicité");
            RuleFor(pub => pub.Adresse_numero).NotEmpty().WithMessage("Veuillez le numéro de l'adresse");
            RuleFor(pub => pub.Quantite).NotEmpty().WithMessage("Veuillez saisir une quantité");
            RuleFor(pub => pub.Face).NotEmpty().WithMessage("Veuillez saisir une type de face");
            RuleFor(pub => pub.Mesure).NotEmpty().WithMessage("Veuillez saisir les mesures du panneau");
            RuleFor(pub => pub.Surface).NotEmpty().WithMessage("Veuillez saisir la surface du panneau");
            RuleFor(pub => pub.Exoneration).NotNull().WithMessage("Veuillez préciser si le panneau bénéficie d'une exonération");
        }
    }
}

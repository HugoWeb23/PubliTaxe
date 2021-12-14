using FluentValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Tarif
    {
        internal decimal data;

        [Key]
        public long Id { get; set; }
        public long ExerciceId { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_non_lumineuse { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_lumineuse { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_enseigne_clignotante { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_non_lumineux { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_lumineux { get; set; }
        [Column(TypeName = "decimal(5,3)")]
        public decimal Prix_unitaire_panneau_a_defilement { get; set; }

    }

    public class TarifValidator : AbstractValidator<Tarif>
    {
        public TarifValidator()
        {
            RuleFor(t => t.ExerciceId).NotEmpty().WithMessage("Veuillez renseigner un exercice");
            RuleFor(t => t.Prix_unitaire_enseigne_non_lumineuse).NotEmpty().WithMessage("Veuillez renseigner un prix");
            RuleFor(t => t.Prix_unitaire_enseigne_lumineuse).NotEmpty().WithMessage("Veuillez renseigner un prix");
            RuleFor(t => t.Prix_unitaire_enseigne_clignotante).NotEmpty().WithMessage("Veuillez renseigner un prix");
            RuleFor(t => t.Prix_unitaire_panneau_non_lumineux).NotEmpty().WithMessage("Veuillez renseigner un prix");
            RuleFor(t => t.Prix_unitaire_panneau_lumineux).NotEmpty().WithMessage("Veuillez renseigner un prix");
            RuleFor(t => t.Prix_unitaire_panneau_a_defilement).NotEmpty().WithMessage("Veuillez renseigner un prix");
        }
    }
}

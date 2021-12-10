using FluentValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Exercice
    {
        [Key]
        public long Id { get; set; }
        public short Annee_exercice { get; set; }
        public string Date_echeance { get; set; }
        public string Date_reglement_taxe { get; set; }

    }

    public class ExerciceValidator : AbstractValidator<Exercice>
    {
        public ExerciceValidator()
        {
            RuleFor(fisc => fisc.Annee_exercice).NotEmpty().WithMessage("Veuillez saisir une année pour l'exercice");
            RuleFor(fisc => fisc.Date_echeance).NotEmpty().WithMessage("Veuillez une date d'échéance");
            RuleFor(fisc => fisc.Date_reglement_taxe).NotEmpty().WithMessage("Veuillez saisir une date de fin pour le règlement des taxes");
        }
    }
}

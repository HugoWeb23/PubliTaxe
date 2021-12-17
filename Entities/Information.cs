using FluentValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Information
    {
        [Key]
        public int Id { get; set; }
        public string Personne_contact { get; set; }
        public string Telephone_contact { get; set; }
        public string Mail_contact { get; set; }
        public long Exercice_courant { get; set; }
        [NotMapped]
        public short Exercice { get; set; }

    }

    public class InformationValidator : AbstractValidator<Information>
    {
        public InformationValidator()
        {
            RuleFor(info => info.Personne_contact).NotEmpty().WithMessage("Veuillez saisir une personne de contact");
            RuleFor(info => info.Telephone_contact).NotEmpty().WithMessage("Veuillez saisir un numéro de téléphone");
            RuleFor(info => info.Mail_contact).NotEmpty().WithMessage("Veuillez saisir une adresse e-mail");
            RuleFor(info => info.Exercice_courant).NotEmpty().WithMessage("Veuillez spécifier l'exercice courant");
        }
    }
}

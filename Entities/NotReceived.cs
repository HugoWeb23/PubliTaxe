﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation;

namespace Taxes.Entities
{
    public class NotReceived
    {
        [Key]
        public long Id { get; set; }
        public long Id_entreprise { get; set; }
        public int Pourcentage_majoration { get; set; }
        public int Motif_majorationId { get; set; }
        [NotMapped]
        public bool Pv { get; set; }
        public long ExerciceId { get; set; }
        public string Date { get; set; }
        public string Remarque  { get; set; }
    }

    public class NotReceivedValidator : AbstractValidator<NotReceived>
    {
        public NotReceivedValidator()
        {
            RuleFor(n => n.Id_entreprise).NotEmpty().WithMessage("Veuillez renseigner un numéro d'entreprise");
            RuleFor(n => n.Motif_majorationId).NotEmpty().WithMessage("Veuillez saisir un motif de majoration");
            RuleFor(n => n.ExerciceId).NotEmpty().WithMessage("Veuillez renseigner un exercice");
            RuleFor(n => n.Pourcentage_majoration).NotEmpty().WithMessage("Veuillez saisir un pourcentage de majoration");
        }
    }
}

using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Taxes.Entities
{
    public class NotReceived
    {
        [Key]
        public long Id { get; set; }
        public long Matricule_ciger { get; set; }
        public int Pourcentage_majoration { get; set; }
        public int Motif_majorationId { get; set; }
        public long ExerciceId { get; set; }
        public string Date { get; set; }
        public string Remarque  { get; set; }
    }

    public class NotReceivedValidator : AbstractValidator<NotReceived>
    {
        public NotReceivedValidator()
        {
            RuleFor(n => n.Matricule_ciger).NotEmpty().WithMessage("Veuillez renseigner un matricule");
            RuleFor(n => n.Motif_majorationId).NotEmpty().WithMessage("Veuillez saisir un motif de majoration");
            RuleFor(n => n.ExerciceId).NotEmpty().WithMessage("Veuillez renseigner un exercice");
            RuleFor(n => n.Pourcentage_majoration).NotEmpty().WithMessage("Veuillez saisir un pourcentage de majoration");
        }
    }
}

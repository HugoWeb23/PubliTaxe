using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation;

namespace Taxes.Entities
{
    public class PublicitesPhotos
    {
        [Key]
        public long Id { get; set; }
        [ForeignKey("Publicite")]
        public long Numero_panneauId { get; set; }
        public string Photo { get; set; }
        public Publicite Publicite { get; set; }
    }

    public class PublicitesPhotosValidator : AbstractValidator<PublicitesPhotos>
    {
        public PublicitesPhotosValidator()
        {
            RuleFor(photo => photo.Numero_panneauId).NotEmpty().WithMessage("Veuillez renseigner l'ID du panneau");
            RuleFor(photo => photo.Photo).NotEmpty().WithMessage("Veuillez renseigner la photo");
        }
    }
}

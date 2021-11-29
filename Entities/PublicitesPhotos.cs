using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
}

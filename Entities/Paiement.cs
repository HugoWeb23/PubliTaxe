using System.ComponentModel.DataAnnotations;

namespace Taxes.Entities
{
    public class Paiement
    {
        [Key]
        public long Id_paiement { get; set; }
        public long Id_entreprise { get; set; }
        public long ExerciceId { get; set; }
        public decimal Montant { get; set; }
        public short Type_paiement { get; set; }
        public short Mode_paiement { get; set; }
        public short Type_carte { get; set; }
        public string Remarque { get; set; }
        public string Date { get; set; }
    }
}

using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class PaymentDetailViewModel
    {
        public Entreprise Entreprise { get; set; }
        public decimal Taxe { get; set; }
        public decimal Montant_majoration { get; set; }
        public decimal Taxe_totale { get; set; }
        public List<Paiement> Paiements { get; set; }
    }
}

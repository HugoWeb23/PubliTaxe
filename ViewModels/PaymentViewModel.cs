using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class PaymentViewModel
    {
        public List<PaiementInfos> Paiements { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
        public int Total_non_payes { get; set; }
        public int Total_partiellement_payes { get; set; }
        public int Total_payes { get; set; }
        public int Total_a_valider { get; set; }
    }
}
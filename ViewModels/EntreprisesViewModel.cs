using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class EntreprisesViewModel
    {
        public List<EntrepriseInfos> Entreprises { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int TotalRecus { get; set; }
        public int TotalPaiementsRecus { get; set; }
        public int TotalEntreprises { get; set; }
        public int TotalDesactives { get; set; }
        public int TotalInfractions { get; set; }
        public int TotalElements { get; set; }
        public int ElementsParPage { get; set; }
    }
}

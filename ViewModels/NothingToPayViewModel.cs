using System.Collections.Generic;

namespace Taxes.ViewModels
{
    public class NothingToPayViewModel
    {
        public List<NothingToPayInfos> Entreprises { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
    }
}

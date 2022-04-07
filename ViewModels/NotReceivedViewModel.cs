using System.Collections.Generic;

namespace Taxes.ViewModels
{
    public class NotReceivedViewModel
    {
        public List<NotReceivedInfos> Entreprises { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
    }
}

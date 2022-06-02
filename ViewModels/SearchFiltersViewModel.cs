using System.Collections.Generic;

namespace Taxes.ViewModels
{
    public class SearchFiltersViewModel
    {
        public long? Matricule { get; set; }
        public string Nom { get; set; }
        public bool PubExoneration { get; set; }
        public int? Rue { get; set; }
        public bool ShowDelete { get; set; }
         public bool ShowDisable { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
    }
}

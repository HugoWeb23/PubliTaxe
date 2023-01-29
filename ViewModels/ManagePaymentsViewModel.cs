namespace Taxes.ViewModels
{
    public class ManagePaymentsViewModel
    {
        public int Exercice { get; set; }
        public string Type { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
        public long? Matricule { get; set; }
    }
}

using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class SimulationsViewModel
    {
        public List<SimulationInfos> Simulations { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int TotalSimulations { get; set; }
        public int ElementsParPage { get; set; }
    }
}

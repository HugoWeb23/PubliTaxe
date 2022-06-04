using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class NothingToPayInfos
    {
        public long Id_entreprise { get; set; }
        public long Matricule_ciger { get; set; }
        public string Nom { get; set; }
        public int Nombre_panneaux { get; set; }
        public List<NothingToPayAdvertisingView> Publicites { get; set; }
    }
}

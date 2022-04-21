namespace Taxes.ViewModels
{
    public class PaiementInfos
    {
        public long Id_entreprise { get; set; }
        public long Matricule_ciger { get; set; }
        public string Nom { get; set; }
        public int Nombre_panneaux { get; set; }
        public int Statut_paiement { get; set; }
        public decimal Taxe_totale { get; set; }
    }
}


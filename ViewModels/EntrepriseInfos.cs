namespace Taxes.ViewModels
{
    public class EntrepriseInfos
    {
        public long Matricule_ciger { get; set; }
        public long Id_entreprise { get; set; }
        public string Nom { get; set; }
        public int Nombre_panneaux { get; set; }
        public bool Proces_verbal { get; set; }
        public bool Recu { get; set; }
        public int Statut_paiement { get; set; }
    }
}

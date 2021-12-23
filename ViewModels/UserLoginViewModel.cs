using Newtonsoft.Json;

namespace Taxes.ViewModels
{
    public class UserLoginViewModel
    {
        public long Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Mail { get; set; }
        public short Actif { get; set; }
        public short Role { get; set; }
        public short Changement_pass { get; set; }
        public string Token { get; set; }
    }
}

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
        public string Token { get; set; }
    }
}

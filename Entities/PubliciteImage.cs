using Microsoft.AspNetCore.Http;

namespace Taxes.Entities
{
    public class PubliciteImage
    {
        public IFormFile Image { get; set; }
        public long Numero_panneau { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;
using MediatR;
using Taxes.Queries;


namespace Taxes.Controllers
{
    [Route("api/entreprises")]
    [ApiController]
    public class EntrepriseController : ControllerBase
    {
        private readonly IMediator _mediator;
        private Context _context;
        public EntrepriseController(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        [HttpGet("getnames")]
        public async Task<IActionResult> GetNames()
        {
            List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesQuery());
            var filtered = entreprises.Select(x => new { x.Matricule_ciger, x.Nom }).ToList();
            return Ok(filtered);
        }

    }
}

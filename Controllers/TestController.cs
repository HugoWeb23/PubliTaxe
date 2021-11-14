using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;
using MediatR;
using Taxes.Queries;
using Taxes.Commands;

namespace Taxes.Controllers
{
    [ApiController]
    [Route("/test")]
    public class TestController : ControllerBase
    {
        private readonly IMediator _mediator;
        public Context _context;
        public TestController(Context context, IMediator mediator)
        {
            _context = context;
            _mediator = mediator;
        }

        [HttpGet("test/{id}")]
        public IActionResult Test(int id)
        {
            try
            {
                List<Entreprise> list = _context.entreprises.ToList();
                Rue rue = new() { Numero_rue = 2, Code_postal = 7701, Langue = "2", Nom_rue = "Rue de test" };
                _context.rues.Add(rue);
                _context.SaveChanges();
                return Ok(new { type = "success" });
            } catch(DbUpdateException)
            {
                return BadRequest(new {error = "Une erreur est survenue !"});
            }
            
        }

        [HttpPost("newentreprise")]
        public async Task<IActionResult> NewEntreprise(Entreprise entreprise)
        {
            try
            {
                Entreprise entr = await _mediator.Send(new InsertEntrepriseCommand(entreprise));
                return Ok(entr);
            } catch(Exception ex)
            {
                return BadRequest(new { erreur = ex });
            }
           
        }

        [HttpPost("newpostalcode")]
        public IActionResult TestCodePostal(Rue rue)
        {
            _context.rues.Add(rue);
            _context.SaveChanges();
            return Ok(new { type = "success", rue = rue });
        }

        [HttpGet("test2")]
        public async Task<IActionResult> Test2()
        {
            List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesQuery());
            var filtered = entreprises.Select(x => new { x.Nom }).ToList();
            return Ok(filtered);
        }
    }
}

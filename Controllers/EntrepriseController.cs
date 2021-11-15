using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;
using MediatR;
using Taxes.Queries;
using Taxes.Commands;
using System;
using Taxes.Filters;

namespace Taxes.Controllers
{
    [ApiController]
    [ErrorFormatter]
    [Route("api/entreprises")]

    public class EntrepriseController : ControllerBase
    {
        private readonly IMediator _mediator;
        public EntrepriseController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("names")]
        public async Task<IActionResult> GetNames()
        {
            List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesQuery());
            var filtered = entreprises.Select(x => new { x.Matricule_ciger, x.Nom }).ToList();
            return Ok(filtered);
        }

        [HttpGet("id/{matricule}")]
        public async Task<IActionResult> GetById(int matricule)
        {
            try
            {
                Entreprise entreprise = await _mediator.Send(new GetEntrepriseById(matricule));
                if (entreprise == null)
                {
                    return BadRequest(new { error = "Aucun enregistrement ne correspond à ce matricule" });
                }
                return Ok(entreprise);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex });
            }
            
        }

        [HttpPost("new")]
        public async Task<IActionResult> NewEntreprise(Entreprise entreprise)
        {
            try
            {
                Entreprise entr = await _mediator.Send(new InsertEntrepriseCommand(entreprise));
                return Ok(entr);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex });
            }

        }

    }
}

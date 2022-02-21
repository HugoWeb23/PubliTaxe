using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

namespace Taxes.Controllers
{
    [Route("api/paiements")]
    [ApiController]
    public class PaiementController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaiementController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("getall/{FiscalYear}")]
        public async Task<IActionResult> PrintAllByCity(long FiscalYear, string Type)
        {
            try
            {
                List<PaiementInfos> entreprises = await _mediator.Send(new GetEntreprisesByPaymentQuery(FiscalYear, Type));
                return Ok(entreprises);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}

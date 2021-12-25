using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Controllers
{
    [Route("api/motifs_majoration")]
    [ApiController]
    public class MotifMajorationController : ControllerBase
    {
        private readonly IMediator _mediator;
        public MotifMajorationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<MotifMajoration> motifs = await _mediator.Send(new GetAllReasonsQuery());
                return Ok(motifs);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }

        }

    }
}

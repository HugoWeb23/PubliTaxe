using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Controllers
{
    [Route("api/rues")]
    [ApiController]
    public class RueController : ControllerBase
    {
        private readonly IMediator _mediator;
        public RueController(IMediator mediator)
        {
            _mediator = mediator;
        }

    [HttpGet("getbycode/{CodeRue}")]
    public async Task<IActionResult> GetAll(string CodeRue)
        {
            List<Rue> rues = await _mediator.Send(new GetStreetsByCodeQuery(CodeRue));
            return Ok(rues);
        }

    }
}

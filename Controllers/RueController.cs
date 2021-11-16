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

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
        {
            List<Rue> rues = await _mediator.Send(new GetAllStreetsQuery());
            return Ok(rues);
        }

    }
}

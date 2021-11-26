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
    [Route("api/prices")]
    [ApiController]

    public class TarifController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TarifController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            List<Tarif> Tarifs = await _mediator.Send(new GetAllPricesQuery());
            return Ok(Tarifs);
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Controllers
{
    [Route("api/fiscalyears")]
    [ApiController]
    public class ExerciceController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ExerciceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            List<Exercice> FiscalYears = await _mediator.Send(new GetAllFiscalYearsQuery());
            return Ok(FiscalYears);
        }
    }
}

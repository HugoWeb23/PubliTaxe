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
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Taxes.Services;


namespace Taxes.Controllers
{
    [Route("api/notreceived")]
    [ApiController]
    public class NotReceivedController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _environment;

        public NotReceivedController(IMediator mediator, IWebHostEnvironment environment)
        {
            _mediator = mediator;
            _environment = environment;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New(NotReceived data)
        {
            try
            {
                NotReceived notReceived = await _mediator.Send(new InsertNotReceivedCommand(data));
                return Ok(notReceived);
            } catch(Exception ex)
            {
                return BadRequest(new { error = "Une erreur est survenue", exception = ex });
            }
            
        }

        [HttpGet("gethistory/{Matricule}")]
        public async Task<IActionResult> GetHistory(long Matricule)
        {
            var NotReceivedHistory = await _mediator.Send(new GetNotReceivedHistoryQuery(Matricule));
            return Ok(NotReceivedHistory);
        }
    }
}

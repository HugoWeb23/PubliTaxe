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
    [AuthorizeRole(MinRole: 2)]
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
                NotReceived notReceived = await _mediator.Send(new InsertNotReceivedCommand(data, true));
                return Ok(notReceived);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("gethistory/{Matricule}")]
        public async Task<IActionResult> GetHistory(long Matricule)
        {
            try
            {
                var NotReceivedHistory = await _mediator.Send(new GetNotReceivedHistoryQuery(Matricule));
                return Ok(NotReceivedHistory);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
            
        }

        [HttpDelete("delete/{Id}")]
        public async Task<IActionResult> DeleteNotReceived(long Id)
        {
            try
            {
                var DeleteNotReceived = await _mediator.Send(new DeleteNotReceivedCommand(Id));
                return Ok(DeleteNotReceived);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}

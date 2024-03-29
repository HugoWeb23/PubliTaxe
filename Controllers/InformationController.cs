﻿using Microsoft.AspNetCore.Mvc;
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
    [Route("api/informations")]
    [AuthorizeRole(MinRole: 1)]
    [ErrorFormatter]
    [ApiController]
    public class InformationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _environment;

        public InformationController(IMediator mediator, IWebHostEnvironment environment)
        {
            _mediator = mediator;
            _environment = environment;
        }

        [HttpGet("getinformations")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                Information informations = await _mediator.Send(new GetInformationsQuery());
                return Ok(informations);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [AuthorizeRole(MinRole: 3)]
        [HttpPut("updateinformations")]
        public async Task<IActionResult> UpdateInformations(Information Informations)
        {
            try
            {
                Information informations = await _mediator.Send(new UpdateInformationsCommand(Informations));
                return Ok(informations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

    }
}

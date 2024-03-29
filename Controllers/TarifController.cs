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

namespace Taxes.Controllers
{
    [Route("api/prices")]
    [AuthorizeRole(MinRole: 1)]
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
            try
            {
                List<Tarif> Tarifs = await _mediator.Send(new GetAllPricesQuery());
                return Ok(Tarifs);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [AuthorizeRole(MinRole: 3)]
        [HttpPost("new")]
        public async Task<IActionResult> New(Tarif Price)
        {
            try
            {
                Tarif newPrice = await _mediator.Send(new InsertPriceCommand(Price));
                return Ok(newPrice);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
            
        }

        [AuthorizeRole(MinRole: 3)]
        [HttpPut("edit")]
        public async Task<IActionResult> Update(Tarif Price)
        {
            try
            {
                Tarif editPrice = await _mediator.Send(new UpdatePriceCommand(Price));
                return Ok(editPrice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}

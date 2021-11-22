﻿using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

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
    public async Task<IActionResult> GetByCode(string CodeRue)
        {
            try
            {
                List<Rue> rues = await _mediator.Send(new GetStreetsByCodeQuery(CodeRue));
                return Ok(rues);
            } catch(Exception e)
            {
                return BadRequest(new ErreurSimple { Erreur = "Une erreur est survenue", Details = e.ToString()});
            }
            
        }

    [HttpPost("getbyname")]
    public async Task<IActionResult> GetByName([FromBody] StreetByNameViewModel NomRue)
    {
        try
        {
            List<Rue> rues = await _mediator.Send(new GetStreetsByNameQuery(NomRue.Nom_rue));
            return Ok(rues);
        }
        catch (Exception e)
        {
            return BadRequest(new ErreurSimple { Erreur = "Une erreur est survenue", Details = e.ToString() });
        }

    }

}
}

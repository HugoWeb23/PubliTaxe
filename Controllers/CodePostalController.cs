using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Controllers
{
    [ApiController]
    [Route("/api/codes_postaux")]
    public class CodePostalController : Controller
    {
        private readonly IMediator _mediator;
        public CodePostalController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet("getall")]
        public async Task<IActionResult> Index()
        {
            try
            {
                List<Code_postal> codes_postaux = await _mediator.Send(new GetAllPostalCodesQuery());
                return Ok(codes_postaux);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("getbycode/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            try
            {
                List<Code_postal> codes_postaux = await _mediator.Send(new GetPostalCodesByCodesQuery(code));
                return Ok(codes_postaux);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("getbylocality/{locality}")]
        public async Task<IActionResult> GetByLocality(string locality)
        {
            try
            {
                List<Code_postal> codes_postaux = await _mediator.Send(new GetPostalCodesByLocalityQuery(locality));
                return Ok(codes_postaux);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
            
        }
    }
}

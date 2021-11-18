using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            List<Code_postal> codes_postaux = await _mediator.Send(new GetAllPostalCodesQuery());
            return Ok(codes_postaux);
        }

        [HttpGet("getbycode/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            List<Code_postal> codes_postaux = await _mediator.Send(new GetPostalCodesByCodesQuery(code));
            return Ok(codes_postaux);
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.Commands;
using Taxes.Filters;

namespace Taxes.Controllers
{
    [Route("api/fiscalyears")]
    [ErrorFormatter]
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
            try
            {
                List<Exercice> FiscalYears = await _mediator.Send(new GetAllFiscalYearsQuery());
                return Ok(FiscalYears);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("getcurrentfiscalyear")]
        public async Task<IActionResult> GetCurrentFiscalYear()
        {
            try
            {
                Exercice FiscalYear = await _mediator.Send(new GetCurrentFiscalYearQuery());
                return Ok(FiscalYear);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
           
        }

        [HttpPost("new")]
        public async Task<IActionResult> CreateYear(Exercice FiscalYear)
        {
            try
            {
                Exercice Year = await _mediator.Send(new InsertFiscalYearCommand(FiscalYear));
                return Ok(Year);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
        }

        [HttpPut("edit")]
        public async Task<IActionResult> UpdateYear(Exercice FiscalYear)
        {
            try
            {
                Exercice Fisc = await _mediator.Send(new UpdateFiscalYearCommand(FiscalYear));
                return Ok(Fisc);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("changecurrentfiscalyear/{FiscalYearId}")]
        public async Task<IActionResult> UpdateCurrentFiscalYear(long FiscalYearId)
        {
            try
            {
                Exercice FiscalYear = await _mediator.Send(new ChangeFiscalYearCommand(FiscalYearId));
                return Ok(FiscalYear);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

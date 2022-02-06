using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.Commands;
using Taxes.Filters;
using Taxes.ViewModels;

namespace Taxes.Controllers
{
    [Route("api/simulations")]
    [ApiController]
    public class SimulationController : ControllerBase
    {
        private readonly IMediator _mediator;
        public SimulationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("getall")]
        public async Task<IActionResult> GetAllSimulations(PaginationViewModel Filters)
        {
            try
            {
                SimulationsViewModel Simulations = await _mediator.Send(new GetAllSimulationsQuery());
                return Ok(Simulations);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("new")]
        public async Task<IActionResult> NewSimulation(Simulation simulation)
        {
            try
            {
                Simulation newSimulation = await _mediator.Send(new InsertSimulationCommand(simulation));
                return Ok(newSimulation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                Simulation newSimulation = await _mediator.Send(new GetSimulationByIdQuery(id));
                return Ok(newSimulation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPut("edit")]
        public async Task<IActionResult> EditSimulation(Simulation simulation)
        {
            try
            {
                Simulation editSimulation = await _mediator.Send(new UpdateSimulationCommand(simulation));
                return Ok(editSimulation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}

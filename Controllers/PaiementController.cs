using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Commands;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;
using Taxes.Filters;

namespace Taxes.Controllers
{
    [Route("api/paiements")]
    [AuthorizeRole(MinRole: 2)]
    [ApiController]
    public class PaiementController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaiementController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("getall")]
        public async Task<IActionResult> PrintAllByCity(ManagePaymentsViewModel Filters)
        {
            try
            {
                PaymentViewModel entreprises = await _mediator.Send(new GetEntreprisesByPaymentQuery(Filters));
                return Ok(entreprises);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex });
            }

        }

        [HttpGet("getpayments/{Matricule}")]
        public async Task<IActionResult> GetPaymentsDetails(long Matricule)
        {
            try
            {
                PaymentDetailViewModel paiements = await _mediator.Send(new GetPaymentDetailQuery(Matricule));
                return Ok(paiements);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpPost("new")]
        public async Task<IActionResult> NewPayment(Paiement Paiement)
        {
            try
            {
                Paiement paiement = await _mediator.Send(new InsertPaymentCommand(Paiement));
                return Ok(paiement);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditPayment(Paiement Paiement)
        {
            try
            {
                Paiement paiement = await _mediator.Send(new UpdatePaymentCommand(Paiement));
                return Ok(paiement);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpDelete("delete/{PaymentId}")]
        public async Task<IActionResult> DeletePayment(long PaymentId)
        {
            try
            {
                bool paiementOk = await _mediator.Send(new DeletePaymentCommand(PaymentId));
                return Ok(paiementOk);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}

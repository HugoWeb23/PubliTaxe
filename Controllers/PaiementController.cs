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
    [ApiController]
    public class PaiementController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaiementController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AuthorizeRole(MinRole: 1)]
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

        [AuthorizeRole(MinRole: 1)]
        [HttpGet("getpayments/{ID}")]
        public async Task<IActionResult> GetPaymentsDetails(long ID)
        {
            try
            {
                PaymentDetailViewModel paiements = await _mediator.Send(new GetPaymentDetailQuery(ID));
                return Ok(paiements);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
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

        [AuthorizeRole(MinRole: 2)]
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

        [AuthorizeRole(MinRole: 2)]
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

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("editnothingtopaystatus")]
        public async Task<IActionResult> EncodeReceived(UpdateNothingToPayStatusViewModel Entreprises)
        {
            try
            {
                List<long> entreprises = await _mediator.Send(new UpdateNothingToPayStatusCommand(Entreprises.Entreprises));
                return Ok(entreprises);
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }

        }
    }
}

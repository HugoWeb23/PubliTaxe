using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Commands;
using Taxes.Queries;
using System;
using Taxes.ViewModels;

namespace Taxes.Controllers
{
    [ApiController]
    [Route("/api/accounts")]
    [AuthorizeRole(MinRole: 3)]
    public class AccountController : Controller
    {
        private readonly IMediator _mediator;
        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("getbyid/{Id}")]
        public async Task<IActionResult> GetById(long Id)
        {
            try
            {
                UserWithoutPassViewModel User = await _mediator.Send(new GetUserByIdQuery(Id));
                return Ok(User);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpGet("getallusers")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<UserWithoutPassViewModel> Users = await _mediator.Send(new GetAllUsersQuery());
                return Ok(Users);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("updateuser")]
        public async Task<IActionResult> UpdateUser(Utilisateur User)
        {
            try
            {
                Utilisateur user = await _mediator.Send(new UpdateUserCommand(User));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

       
        [HttpGet("newpassword/{UserID}")]
        public async Task<IActionResult> NewPassword(long UserID)
        {
            try
            {
                string NewPassword = await _mediator.Send(new GenerateNewUserPasswordCommand(UserID));
                return Ok(new {password = NewPassword});
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("deleteuser/{UserID}")]
        public async Task<IActionResult> DeleteUser(long UserID)
        {
            try
            {
                bool DeleteSuccess = await _mediator.Send(new DeleteUserCommand(UserID));
                if (!DeleteSuccess) return BadRequest(new { error = "Une erreur est survenue" });
                return Ok(new { success = "L'utilisateur a été supprimé"});
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("inactiveaccounts")]
        public async Task<IActionResult> GetInactiveAccounts()
        {
            try
            {
                List<UserWithoutPassViewModel> utilisateurs = await _mediator.Send(new GetInactiveAccountsQuery());
                return Ok(utilisateurs);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}

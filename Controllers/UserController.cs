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
    [Route("/api/user")]
    public class UserController : Controller
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("newaccount")]
        public async Task<IActionResult> NewAccount(Utilisateur Utilisateur)
        {
            try
            {
                UserWithoutPassViewModel User = await _mediator.Send(new NewUserCommand(Utilisateur));
                return Ok(User);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, ex = ex });
            }

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel Utilisateur)
        {
            try
            {
                UserLoginViewModel User = await _mediator.Send(new LoginQuery(Utilisateur));
                return Ok(User);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpGet("getuser")]
        public IActionResult GetUser()
        {
            try
            {
                UserWithoutPassViewModel User = (UserWithoutPassViewModel)HttpContext.Items["User"];
                if (User == null)
                {
                    return BadRequest(new {error = "Vous n'êtes pas connecté"});
                }
                return Ok(User);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpPut("changepassword/{UserID}")]
        public async Task<IActionResult> ChangePassword(long UserID, ChangePasswordViewModel Data)
        {
            try
            {
                Data.UserID = UserID;
                bool UpdatePassword = await _mediator.Send(new ChangePasswordCommand(Data));
                if (!UpdatePassword) return BadRequest(new { error = "Une erreur est survenue" });

                return Ok( new { success = "Le mot de passe a été modifié"});
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 1)]
        [HttpPut("myaccount")]
        public async Task<IActionResult> UpdateMyAccount(Utilisateur Data)
        {
            try
            {
                UserWithoutPassViewModel User = (UserWithoutPassViewModel)HttpContext.Items["User"];
                Data.Id = User.Id;
                UserWithoutPassViewModel NewUser = await _mediator.Send(new EditMyAccountCommand(Data));
                return Ok(NewUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

    }
}

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
    [Authorize]
    [AuthorizeRole(MinRole: 3)]
    public class AccountController : Controller
    {
        private readonly IMediator _mediator;
        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("newaccount")]
        public async Task<IActionResult> NewAccount(Utilisateur Utilisateur)
        {
            try
            {
                Utilisateur User = await _mediator.Send(new NewUserCommand(Utilisateur));
                return Ok(User);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
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
                Utilisateur User = (Utilisateur)HttpContext.Items["User"];
                if (User == null)
                {
                    return BadRequest();
                }
                return Ok(User);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpGet("getbyid/{Id}")]
        public async Task<IActionResult> GetById(long Id)
        {
            try
            {
                Utilisateur User = await _mediator.Send(new GetUserByIdQuery(Id));
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
                List<Utilisateur> Users = await _mediator.Send(new GetAllUsersQuery());
                return Ok(Users);
            } catch (Exception)
            {
                return BadRequest(new { error = "Une erreur est survenue" });
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
            catch (Exception e)
            {
                return BadRequest(new { error = "Une erreur est survenue", ex = e.Message });
            }
        }

    }
}

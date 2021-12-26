using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using Taxes.Entities;
using Taxes.ViewModels;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeRoleAttribute : Attribute, IAuthorizationFilter
{
    private short Role;
    public AuthorizeRoleAttribute(short MinRole)
    {
        Role = MinRole;
    }
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = (UserWithoutPassViewModel)context.HttpContext.Items["User"];

        if(user == null)
        {
            context.Result = new JsonResult(new { error = "Vous devez vous connecter afin d'effectuer cette action" }) { StatusCode = StatusCodes.Status401Unauthorized };

        } else if(user.Role < Role)

        {
            context.Result = new JsonResult(new { error = "Vous n'avez pas la permission d'effectuer cette action" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}
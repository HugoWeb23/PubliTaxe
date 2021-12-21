﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using Taxes.Entities;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = (Utilisateur)context.HttpContext.Items["User"];
        if (user == null)
        {
            context.Result = new JsonResult(new { error = "Vous devez vous connecter afin d'effectuer cette action" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace Taxes.Filters
{
    public class ErrorFormatterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = new Dictionary<string, List<string>>();
                foreach (var modelState in context.ModelState)
                {
                    errors.Add(modelState.Key.ToLower(), modelState.Value.Errors.Select(a => a.ErrorMessage).ToList());
                }
                context.Result = new BadRequestObjectResult(new { errors = errors });
            }
        }
    }
}

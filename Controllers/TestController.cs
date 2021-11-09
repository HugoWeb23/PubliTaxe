using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;

namespace Taxes.Controllers
{
    [ApiController]
    [Route("/test")]
    public class TestController : ControllerBase
    {
        public Context _context;
        public TestController(Context context)
        {
            _context = context;
        }

        [HttpGet("test")] 
        public IActionResult Test()
        {
            Test test = _context.test.FirstOrDefault(test => test.Nom == "Hourriez");
            return Ok(test);
        }
    }
}

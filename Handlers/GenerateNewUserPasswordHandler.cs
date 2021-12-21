using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Commands;

namespace Taxes.Handlers
{
    public class GenerateNewUserPasswordHandler : IRequestHandler<GenerateNewUserPasswordCommand, string>
    {
        public Context _context;

        public GenerateNewUserPasswordHandler(Context context)
        {
            _context = context;
        }
        public Task<string> Handle(GenerateNewUserPasswordCommand request, CancellationToken cancellationToken)
        {
            string NewPassword = "abcd1234";

            return Task.FromResult(NewPassword);
        }
    }
}

using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record ResetAppCommand() : IRequest<bool>;
}

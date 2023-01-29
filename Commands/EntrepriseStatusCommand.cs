using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record EntrepriseStatusCommand(long Id, int type) : IRequest<bool>;
}
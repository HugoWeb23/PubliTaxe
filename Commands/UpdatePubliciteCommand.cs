using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdatePubliciteCommand(Publicite Publicite) : IRequest<Publicite>;
}

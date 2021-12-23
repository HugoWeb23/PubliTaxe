using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateInformationsCommand(Information Informations) : IRequest<Information>;
}

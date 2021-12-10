using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateFiscalYearCommand(Exercice FiscalYear) : IRequest<Exercice>;
}

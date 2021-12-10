using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record UpdateFiscalYearCommand(short Year, Exercice FiscalYear) : IRequest<Exercice>;
}

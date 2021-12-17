using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record ChangeFiscalYearCommand(long FiscalYearId) : IRequest<Exercice>;
}

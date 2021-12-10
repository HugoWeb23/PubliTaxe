using MediatR;
using Taxes.Entities;

namespace Taxes.Commands
{
    public record InsertFiscalYearCommand(Exercice FiscalYear) : IRequest<Exercice>;
}


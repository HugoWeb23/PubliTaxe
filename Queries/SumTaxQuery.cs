using MediatR;
using System.Collections.Generic;
using Taxes.Entities;
namespace Taxes.Queries
{
    public record SumTaxQuery(long Exercice, short Type_publicite, short Quantite, short Face, decimal Surface) : IRequest<decimal>;
}

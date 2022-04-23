using MediatR;
using System.Collections.Generic;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Queries
{
    public record GetAllEntreprisesByDeletionRequestQuery(EntreprisesDeletionViewModel Filters) : IRequest<NotReceivedViewModel>;
}

﻿using MediatR;
using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.Queries
{
    public record GetAllPricesQuery() : IRequest<List<Tarif>>;
}

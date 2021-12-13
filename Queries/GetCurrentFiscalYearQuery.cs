﻿using MediatR;
using System.Collections.Generic;
using Taxes.Entities;
namespace Taxes.Queries
{
    public record GetCurrentFiscalYearQuery() : IRequest<Exercice>;
}


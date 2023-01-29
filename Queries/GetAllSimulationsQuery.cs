﻿using MediatR;
using System.Collections.Generic;
using Taxes.Entities;
using Taxes.ViewModels;

namespace Taxes.Queries
{
    public record GetAllSimulationsQuery(SimulationFilters Filters) : IRequest<SimulationsViewModel>;
}

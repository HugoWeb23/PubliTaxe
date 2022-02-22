﻿using System.Collections.Generic;
using Taxes.Entities;

namespace Taxes.ViewModels
{
    public class PaymentViewModel
    {
        public List<PaiementInfos> Paiements { get; set; }
        public int TotalPages { get; set; }
        public int PageCourante { get; set; }
        public int ElementsParPage { get; set; }
    }
}
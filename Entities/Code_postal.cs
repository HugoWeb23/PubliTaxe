using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Code_postal
    {
        public int numero_localite { get; set; }
        public int code_pays { get; set; }
        public int code_postal { get; set; }
        public string localite { get; set; }
        public string pays { get; set; }

    }
}

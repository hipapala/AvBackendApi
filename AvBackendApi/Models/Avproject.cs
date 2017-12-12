using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avproject
    {
        public Avproject()
        {
            Avxml = new HashSet<Avxml>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public int? Domainid { get; set; }
        public bool? Isdefault { get; set; }

        public Avdomain Domain { get; set; }
        public Avconfig Avconfig { get; set; }
        public ICollection<Avxml> Avxml { get; set; }
    }
}

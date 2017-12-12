using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avenumrole
    {
        public Avenumrole()
        {
            Avuserdomain = new HashSet<Avuserdomain>();
        }

        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<Avuserdomain> Avuserdomain { get; set; }
    }
}

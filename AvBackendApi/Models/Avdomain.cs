using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avdomain
    {
        public Avdomain()
        {
            Avproject = new HashSet<Avproject>();
            Avuserdomain = new HashSet<Avuserdomain>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Created { get; set; }

        public ICollection<Avproject> Avproject { get; set; }
        public ICollection<Avuserdomain> Avuserdomain { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avuser
    {
        public Avuser()
        {
            Avuserdomain = new HashSet<Avuserdomain>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public string Password { get; set; }
        public bool Issuperadmin { get; set; }

        public ICollection<Avuserdomain> Avuserdomain { get; set; }
    }
}

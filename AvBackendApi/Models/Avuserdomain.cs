using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avuserdomain
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public int Userid { get; set; }
        public int Domainid { get; set; }
        public short Roleid { get; set; }

        public Avdomain Domain { get; set; }
        public Avenumrole Role { get; set; }
        public Avuser User { get; set; }
    }
}

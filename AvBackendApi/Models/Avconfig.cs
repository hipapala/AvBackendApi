using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avconfig
    {
        public int Id { get; set; }
        public int? Projectid { get; set; }
        public string Data { get; set; }

        public Avproject Project { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace AvBackend
{
    public partial class Avxml
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public int? Projectid { get; set; }
        public string Data { get; set; }

        public Avproject Project { get; set; }
    }
}

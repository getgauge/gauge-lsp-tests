using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Gauge.CSharp.Lib;
using Gauge.CSharp.Lib.Attribute;

namespace netcore.template
{
    public class Alias
    {
        [Step("alias1","alias2")]
        public void HelloWorld(string user_name) {
            // create user user_name
        }
    }
}
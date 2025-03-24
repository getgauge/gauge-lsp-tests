using System;
using System.Collections.Generic;
using System.Linq;
using Gauge.CSharp.Lib;
using Gauge.CSharp.Lib.Attribute;

namespace netcore.template
{
    public class StepImplementation
    {
        [Step("implemented step one")]
        public void implementedStepOne()
        {
        }

        [Step("implemented step two")]
        public void implementedStepTwo()
        {
        }
    }
}

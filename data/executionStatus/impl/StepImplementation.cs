using System;
using System.Collections.Generic;
using System.Linq;
using Gauge.CSharp.Lib;
using Gauge.CSharp.Lib.Attribute;

namespace netcore.template
{
    public class StepImplementation
    {
        [Step("A step that passes")]
        public void aStepThatPasses()
        {
        }

        [Step("A Step to fail")]
        public void aStepToFail()
        {
            throw new Exception("A Step to fail");
        }
    }
}

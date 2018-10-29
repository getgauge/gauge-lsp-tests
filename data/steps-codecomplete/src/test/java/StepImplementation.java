import com.thoughtworks.gauge.Step;
import com.thoughtworks.gauge.Table;
import com.thoughtworks.gauge.TableRow;

import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

public class StepImplementation {
    @Step("implemented step one")
    public void implementedStepOne()
    {
    }

    @Step("implemented step two")
    public void implementedStepTwo()
    {
    }
}

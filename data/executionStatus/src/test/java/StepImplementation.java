import com.thoughtworks.gauge.*;

public class StepImplementation {
    @Step("A step that passes")
    public void aStepThatPasses()
    {
    }

    @Step("A Step to fail")
    public void aStepToFail() throws Exception
    {
        throw new Exception("A Step to fail");
    }

}

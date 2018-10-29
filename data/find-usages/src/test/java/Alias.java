import com.thoughtworks.gauge.*;

public class StepImplementation {

    @Step({"alias1", "alias2"})
    public void createUser(String user_name) {
        // create user user_name
    }
}

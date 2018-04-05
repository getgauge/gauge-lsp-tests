from getgauge.python import step, before_scenario, Messages

@step("A step that passes")
def a_step_that_passes():
    assert 1, 1

@step("A Step to fail")
def a_step_to_fail():
    assert 1, 2

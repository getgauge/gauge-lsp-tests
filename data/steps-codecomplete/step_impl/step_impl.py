from getgauge.python import step

@step("implemented step one")
def step_with_alias():
    print("implemented step one")

@step("implemented step two")
def step_with_alias():
    print("implemented step two")
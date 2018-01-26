from getgauge.python import step

@step(["alias1","alias2"])
def step_with_alias():
    print("hello")

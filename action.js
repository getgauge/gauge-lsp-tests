const {
  getInput,
  setFailed
} = require("@actions/core");

const {
  exec
} = require("@actions/exec");

const {
  join
} = require("path");

const artifact = require("@actions/artifact");

(async function () {

  try {
    const lsp_repo_url = "https://github.com/getgauge/gauge-lsp-tests";
    const env = getInput("env");

    let gauge_lsp_dir = join(process.env["RUNNER_TEMP"] || "",
      "temp_" + Math.floor(Math.random() * 2000000000), "gauge-lsp-tests");

    await exec("git", ["clone", lsp_repo_url, gauge_lsp_dir, "--depth=1"]);
    process.chdir(gauge_lsp_dir);

    await exec("npm", ["install"]);
    await exec("gauge", ["install"]);

    let failed = await exec("gauge", ["run",
      "--tags='!knownIssue & (actions_on_project_load | actions_on_file_edit)'",
      `--env=${env}`
    ]);

    if (failed) {
      let client = artifact.create();
      client.uploadArtifact(`lsp-logs-${ process.platform }`, ["logs"], gauge_lsp_dir);
    }

  } catch (error) {
    setFailed(error.message);
  }

})();
# Configuration File for liminal.market.contracts

This configuration file is specifically designed for developers working with the `liminal.market.contracts` package. If you are using this package in your project, this file is not relevant to you.

The configuration file contains the following settings:

```json
{
  "ignore_compile": true,
  "node_version": "16.15.0",
  "exclude_informational": false,
  "exclude_low": false,
  "exclude_medium": false,
  "exclude_high": false,
  "disable_color": false
}
```

## Settings Description

- `ignore_compile`: This setting, when set to `true`, will ignore any compilation errors that may occur during the development process. This can be useful for developers who want to focus on specific parts of the code without being interrupted by unrelated compilation issues.

- `node_version`: This setting specifies the required Node.js version for the project. In this case, the required version is `16.15.0`. Make sure to use the specified version to avoid any compatibility issues.

- `exclude_informational`: When set to `true`, this setting will exclude informational messages from the output. This can help developers focus on more critical issues during development.

- `exclude_low`: When set to `true`, this setting will exclude low-severity issues from the output. This can be helpful for developers who want to prioritize more severe issues during development.

- `exclude_medium`: When set to `true`, this setting will exclude medium-severity issues from the output. This can be helpful for developers who want to prioritize high-severity issues during development.

- `exclude_high`: When set to `true`, this setting will exclude high-severity issues from the output. This can be helpful for developers who want to focus on less severe issues during development.

- `disable_color`: When set to `true`, this setting will disable color output in the console. This can be useful for developers who prefer a more minimalistic output or are using a terminal that does not support color.

Make sure to adjust these settings according to your development preferences and requirements.
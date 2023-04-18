### App-specific Config Files

There are two app-specific config files in the application:

1. `hardhat.config.ts`
2. `slither.config.json`

#### hardhat.config.ts

`hardhat.config.ts` is the configuration file for the Hardhat development environment. It contains various configurations, plugins, and tasks for the project. The purpose of this file is to set up the development environment and automate various tasks related to the project, such as compiling, deploying, and testing smart contracts.

Here is an example of how to use the app-specific configs in `hardhat.config.ts`:

```typescript
import { task } from "hardhat/config";

task("exampleTask", "An example task", async (taskArgs, hre) => {
  // Your task implementation here
});
```

#### slither.config.json

`slither.config.json` is the configuration file for the Slither static analysis tool. It contains various configurations for the Slither tool, such as the target smart contracts, detectors, and output formats. The purpose of this file is to set up the Slither tool to analyze the smart contracts in the project and identify potential security vulnerabilities.

Here is an example of how to use the app-specific configs in `slither.config.json`:

```json
{
  "detectors": {
    "all": true
  },
  "filter_paths": ["contracts/"],
  "output": {
    "format": "json",
    "filename": "slither-report.json"
  }
}
```

### Note

Remember to replace any sensitive information with `*****` when sharing the content of the config files.
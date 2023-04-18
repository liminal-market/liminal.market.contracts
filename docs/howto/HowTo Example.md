# How to Add a HowTo in the Config File

## Introduction
This guide will walk you through the process of adding a HowTo in the config file. The `args` property is used to inject properties into the liquid template, and any property set in `args` can be accessed in the liquid template. The `file` property appends the extracted content of a file to the liquid template, using JSONPath or the `extract` property that uses LLM to extract content from the file. Developers must create a liquid template in the `.code-narrator/gpt_questions` directory, which is used to ask GPT questions.

## Step-by-Step Instructions

1. **Create a liquid template file**: Navigate to the `.code-narrator/gpt_questions` directory in your project and create a new liquid template file. Name it according to the HowTo you want to add, for example, `howto_example.liquid`.

2. **Edit the liquid template**: Open the newly created liquid template file and add the necessary content, including variables that will be replaced by the `args` property values.

   Example:
   ```
   How to {{ action }} in the {{ environment }}:
   ```

3. **Update the config file**: Open your project's config file (e.g., `config.yml`) and add a new entry for the HowTo you want to include.

   Example:
   ```yaml
   howtos:
     - name: example
       template: howto_example.liquid
       args:
         action: "add a new feature"
         environment: "development"
       file:
         path: "path/to/your/file.json"
         extract: "path.to.content"
   ```

   In this example, replace `path/to/your/file.json` with the actual path to the JSON file you want to extract content from, and `path.to.content` with the JSONPath or LLM expression to extract the desired content.

4. **Test your configuration**: Run your project with the updated config file and verify that the HowTo is correctly added and the content is extracted as expected.

That's it! You have successfully added a HowTo in the config file using the `args` property and the `file` property to inject properties and extract content from a file.
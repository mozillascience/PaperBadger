# Contribution Guidelines

## Reporting issues

- **Search for existing issues.** Please check to see if someone else has reported the same issue.
- **Share as much information as possible.** Include operating system and version, browser and version. Also, include steps to reproduce the bug.

## Project Setup

Refer to the [README](README.md).

## Code Style

### Editor
Please use an editor with support for [ESLint](http://eslint.org/) and [EditorConfig](http://editorconfig.org/). Configuration
files for both tools are provided in the root directory of the project.

### JavaScript

See [Mozilla Foundation JavaScript Style Guide](https://www.npmjs.com/package/mofo-style)

This project is currently _in transition_ to fully support the latest
[mofo-style](https://www.npmjs.com/package/mofo-style) version. At the moment it uses a modified version of .eslintrc.yaml, provided
in the root directory, instead of using the file inside ./node-modules/mofo-style/.eslintrc.yaml, in order to make the transition
easier and smoother.

**TL;DR** Run `npm run lint` before pushing a commit. It will validate your JS.

#### Variable Naming

- `lowerCamelCase` General variables
- `UpperCamelCase` Constructor functions
- Use semantic and descriptive variables names (e.g. `colors` *not* `clrs` or `c`). Avoid abbreviations except in cases of industry wide usage (e.g. `AJAX` and `JSON`).

### HTML

- 2 space indentation
- Class names use hypenated case (e.g. `my-class-name`)

### LESS / CSS

- 2 space indentation
- Always a space after a property's colon (e.g. `display: block;` *not* `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on it's own line

## Testing

Any patch should be manually tested in as many of our supported browsers as possible. Obviously, access to all devices is rare, so just aim for the best coverage possible. At a minimum please test in all available desktop browsers.

You can run all automated tests with `mocha test/*` or `npm test`. If _mocha_ is not installed globally, please use `./node_modules/mocha/bin/mocha test/*`.

_Unit_ and _Integration_ tests can also be run separately with `npm run test:unit` and `npm run test:integration` respectively.

## Pull requests

- Try not to pollute your pull request with unintended changes – keep them simple and small. If possible, squash your commits.
- Try to share which browsers and devices your code has been tested in before submitting a pull request.
- If your PR resolves an issue, include **closes #ISSUE_NUMBER** in your commit message (or a [synonym](https://help.github.com/articles/closing-issues-via-commit-messages)).
- Review
    - If your PR is ready for review, another contributor will be assigned to review your PR within 1 business day
    - The reviewer will comment on the PR with a final r+ or r-, along with inline comments on the code (if any)
        - r-: address the comments left by the reviewer. Once you're ready to continue the review, ping the reviewer in a comment.
        - r+: You code will be merged to `master`

# Contribution Guidelines

## Reporting issues

- **Search for existing issues.** Please check to see if someone else has reported the same issue.
- **Share as much information as possible.** Include operating system and version, browser and version. Also, include steps to reproduce the bug.

## Project Setup

Refer to the [README](README.md).

## Code Style

### JavaScript

See [Mozilla Foundation JavaScript Style Guide](https://www.npmjs.com/package/mofo-style)

JS files must pass JSHint using the provided [.jshintrc](https://github.com/MozillaFoundation/javascript-style-guide/blob/master/linters/.jshintrc) settings.

Additionally, JS files need to be run through [JSBeautify](https://github.com/einars/js-beautify) with the provided [.jsbeautifyrc](https://github.com/MozillaFoundation/javascript-style-guide/blob/master/linters/.jsbeautifyrc).

**TL;DR** Run `npm run lint` before pushing a commit. It will validate and beautify your JS.

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

Any patch should be tested in as many of our supported browsers as possible. Obviously, access to all devices is rare, so just aim for the best coverage possible. At a minimum please test in all available desktop browsers.

Run tests with `mocha` or `npm test`.

## Pull requests

- Try not to pollute your pull request with unintended changes – keep them simple and small. If possible, squash your commits.
- Try to share which browsers and devices your code has been tested in before submitting a pull request.
- If your PR resolves an issue, include **closes #ISSUE_NUMBER** in your commit message (or a [synonym](https://help.github.com/articles/closing-issues-via-commit-messages)).
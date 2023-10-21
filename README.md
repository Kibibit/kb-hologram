<p align="center">
  <a href="https://github.com/Kibibit/kb-hologram" target="blank"><img src="http://kibibit.io/kibibit-assets/kb-hologram/logo.svg" width="150" ></a>
  <h2 align="center">
    @kibibit/kb-hologram
  </h2>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@kibibit/kb-hologram"><img src="https://img.shields.io/npm/v/@kibibit/kb-hologram/latest.svg?style=for-the-badge&logo=npm&color=CB3837"></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@kibibit/kb-hologram"><img src="https://img.shields.io/npm/v/@kibibit/kb-hologram/next.svg?style=flat-square&logo=npm&color=CB3837"></a>
  <a href="https://travis-ci.org/Kibibit/kb-hologram">
  <img src="https://travis-ci.org/Kibibit/kb-hologram.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/Kibibit/kb-hologram?branch=master">
  <img src="https://coveralls.io/repos/github/Kibibit/kb-hologram/badge.svg?branch=master">
  </a>
  <a href="http://greenkeeper.io">
    <img src="https://badges.greenkeeper.io/Kibibit/kb-hologram.svg">
  </a>
  <a href="https://salt.bountysource.com/teams/kibibit"><img src="https://img.shields.io/endpoint.svg?url=https://monthly-salt.now.sh/kibibit&style=flat-square"></a>
</p>
<p align="center">
  Create images from templates and data
</p>
<hr>

## how to use

### Installation

```bash
$ npm install --save @kibibit/kb-hologram
```

### Usage

```javascript
import { KbHologram, KbHologramResultType } from "@kibibit/kb-hologram";

const kbHologram = new KbHologram({
  fontName: "../Comfortaa-Regular.ttf",
  templateName: "changelog-template",
  height: 534 * 2,
  width: 1069 * 2,
  data: {
    columnOne: [
      "Compact folders in Explorer",
      "Edit both files in diff view",
      "Search results update while typing",
      "Problems panel filtering by type",
      "Minimap highlights errors, changes",
      "Terminal minimum contrast ratio",
    ],
    columnTwo: [
      "Mirror cursor in HTML tags",
      "Optional chaining support in JS\\TS",
      "Extract to interface TS refactoring",
      "Sass module support for @use",
      "Remote - Containers improvements",
      "Visual Studio Online preview",
    ],
    title: "achievibit",
    subtitle: "v2.1.4 - CHANGELOG",
    logo: {
      url: "data:image/png;base64,<icon-data>",
      alt: "kibibit",
    },
  },
  type: "html",
});

const pngBuffer = await kbHologram.render(KbHologramResultType.PngBuffer);
```

Which will return a **png buffer** for the following image:
![generated changelog](https://raw.githubusercontent.com/Kibibit/kb-hologram/next/src/__image_snapshots__/image-maker-spec-ts-image-maker-should-generate-changelog-from-html-template-1-snap.png)

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Neil Kalman](https://github.com/thatkookooguy)

## Contributors

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](CONTRIBUTING.MD).

You can check out some easy to start with issues in the [Easy Pick](https://github.com/Kibibit/kb-hologram/labels/Easy%20Pick).

## Contributor Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md).

By participating in this project you agree to abide by its terms.

## License

[MIT License](LICENSE)

Copyright (c) 2020 Neil Kalman &lt;neilkalman@gmail.com&gt;

<div>Module Icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

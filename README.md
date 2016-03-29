# electron-require

> Simplified require in electron applications

`electron-require` is a super basic, no dependency convenience wrapper around `require` for your electron applications. You can use it to avoid using complex paths (such as `require('../../renderer/module.js')`) in your application.

## Disclaimer

1) This module is still unstable.
 
2) Currently, it assumes that your app is organized with the following structure:

```
.
├── app
│   ├── main
│   │   └── [main process modules]
│   └── renderer
│       └── [renderer process modules]
└── package.json
```

Support for other architecture will come in future versions.

## Installation

`$ npm install --save electron-require`

Then include it in your code:

```javascript
const rq = require('electron-require');
```

## Usage

`rq('module.js')` imports `module.js` from the current process directory (it is actually an alias to `require.main.require('module.js')`).

`rq.main('module.js')` (or `rq.browser('module.js')`) imports `app/main/module.js`.

`rq.renderer('module.js')` imports `app/renderer/module.js`.

`rq.root('module.js')` imports `module.js` from the root (i.e. the directory that contains `package.json`).

`rq.remote('module')` is the same than `require('electron').remote.require('module')`, except that it resolves into `rq.main('module')` when used in the main process.

You can add your own custom path or override existing ones with `rq.set`:

```javascript
let userData = electron.app.getPath('userData');
rq.set('plugin', userData + '/plugins');
const myPlugin = rq.plugin('my-plugin');
```

## Todo

* [] Add support for various app architectures
* [] Write tests

## License

The MIT License (MIT)
Copyright (c) 2016 Thomas Brouard

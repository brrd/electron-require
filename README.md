# electron-require

> Simplified require in electron applications

`electron-require` is a super basic, no dependency convenience wrapper around `require` for your electron applications. You can use it to avoid using complex require paths in your application.

## Installation

`$ npm install --save electron-require`

Then include it in your code:

```javascript
const rq = require('electron-require');
```

## Usage

### `rq()`

`rq('./module.js')` imports `module.js` from the current process directory (it is actually an alias to `require.main.require('./module.js')`).

### `rq.electron()`

`rq.electron('module')` is the same than `require('electron')['module']`, except that it resolves into `require('electron').remote['module']` when module is not found, if used in the renderer process.

### `rq.remote()`

`rq.remote('module')` is the same than `require('electron').remote.require('module')`, except that it resolves into `rq.main('module')` when used in the main process.

### Aliases

You can add your own custom alias with `rq.set(key, path)`.

Once `rq.set('myAlias', 'my/path')` is called, `rq.myAlias('./module.js')` will try to load `my/path/module.js`.

**Example 1:**

```javascript
rq.set('local', 'local');

// Import [application root]/local/my-local-module.js into myLocalModule
const myLocalModule = rq.local('./my-local-module.js');
```

**Example 2:**

```javascript
let userData = electron.app.getPath('userData');
rq.set('plugin', userData + '/plugins');

// Import [userdata]/plugins/my-plugin.js into myPlugin
const myPlugin = rq.plugin('/my-plugin.js');
```

#### Template strings

You can use template string in the `path` passed to `.set()`:

* `%{app}` resolves to `app.getAppPath()`
* `%{anyOtherName}` resolves to `app.getPath(anyOtherName)`

So we can write example 2 in a simpler way:

```javascript
rq.set('plugin', '%{userData}/plugins');

// Import [userdata]/plugins/my-plugin.js into myPlugin
const myPlugin = rq.plugin('/my-plugin.js');
```

Read more about this in [the app module documentation](https://github.com/electron/electron/blob/master/docs/api/app.md)

#### Multiple alias

`rq.set` can also be used with an object:

```javascript
rq.set({
	'local': 'local',
    'plugin': '%{userData}/plugins'
});
```

#### Custom aliases defined in package.json

In most cases you will want to use the same custom aliases for the whole project. You can define custom aliases by adding an `electron-require` key to your app `package.json` file:

```json
"electron-require": {
    "first": "path/to/first/alias",
	"second": "path/to/second/alias"
}
```

#### Default aliases

Default aliases are the following:

```json
{
    "root": "",
    "renderer": "app/renderer",
    "main": "app/main",
    "browser": "app/main"
}
```

It actually assumes that your app is organized in the following way:

```
.
├── app
│   ├── main
│   │   └── [main process modules]
│   └── renderer
│       └── [renderer process modules]
└── package.json
```

But you can of course override theses default values by using `rq.set()` or by adding an `electron-require` entry in your `package.json`.

## License

The MIT License (MIT)  
Copyright (c) 2016 Thomas Brouard

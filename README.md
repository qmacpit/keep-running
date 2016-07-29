## keep-running

Node.js utility that keeps node app running / prevents node app from  exiting


### Install

```bash
npm install keep-running
```

### Usage

- check __example/example.js__
```js
const keepRunning = require('keep-running');
keepRunning.init()(() => console.log('runing forever....'));
```

### Testing

```bash
npm install -g mocha
```

```js
mocha test
```

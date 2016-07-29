## keep-running

Node.js utility that keeps node app running / prevents node app from  exiting


### Install

```bash
npm install keep-running
```

### Usage

- check __example/example.js__
```bash
node example/example.js
```
program runs until you manually stop it (Ctrl+C)
- code sample
```js
const keepRunning = require('keep-running');
keepRunning.init()(() => console.log('running forever....'));
```

### Limitations
- tested & used only in Linux

### Testing

```bash
npm install -g mocha
```

```js
mocha test
```

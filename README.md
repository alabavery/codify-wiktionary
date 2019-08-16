<h1>codify wiktionary</h1>
This is a library for parsing [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Main_Page).  The primary funionality is to take a given word and provide all relevant data about it in json format, using Wiktionary. For now, it is focused on Spanish, but most of the functionality can be used for other languages or at the very least adapted for other languages.
<br><br><br>
Run scripts through
`babel-node <script-path> [options] [arguments]`

See [this](https://github.com/babel/babel/issues/1730) and [this](https://github.com/babel/babel/issues/5542) for why you may be having trouble passing arguments using a `npm run` script.
<br><br>
Scripts are:
- `./main/index.js`: parse every page in `./data/wiktionary`
- `./main/parse-pages`: parse every page passed as arguments, e.g. `babel-node ./main/parse-pages ./data/wiktionary/abajo.txt ./data/wiktionary/haber.txt`
- part of speech specific parsing scripts in `./parts-of-speech`, e.g. `./parts-of-speech/verb/index.js`
<br><br><br>
Babel set up follows [this guide](https://www.robinwieruch.de/minimal-node-js-babel-setup/).

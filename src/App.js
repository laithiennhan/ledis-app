import React, { useRef, useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { handleInput } from './api/ledisAPI.js';

function App() {
  const ref = useRef();
  const [term, setTerm] = useState();

  useEffect(() => {
    let curTerm = term;
    if (!curTerm) {
      curTerm = new Terminal();
      setTerm(curTerm);
      curTerm.open(ref.current);
      curTerm.writeln('Welcome to Ledis');
      curTerm.writeln('This is a simple database, with commands similar to Redis (hence the name!).');
      let shellprompt = '$ ';
      curTerm.writeln('');
      curTerm.prompt = function () {
        curTerm.write('\r\n' + shellprompt);
      };

      curTerm.prompt();

      let cmd = '';

      curTerm.onKey(({ key, domEvent }) => {
        var printable = (
          !domEvent.altKey &&
          !domEvent.altGraphKey &&
          !domEvent.ctrlKey &&
          !domEvent.metaKey
        );

        if (domEvent.keyCode === 13) {
          if (cmd === 'clear') {
            curTerm.clear();
          }
          // TODO: cmd = "the whole string".
          try {
            curTerm.write('\r\n>>> ' + handleInput(cmd));
          } catch (err) {
            curTerm.write('\r\n>>> ' + err);
          }
          cmd = '';
          curTerm.prompt();
        } else if (domEvent.keyCode === 8) {

          if (cmd.length > 0) {
            curTerm.write('\b \b');
            cmd = cmd.slice(0, cmd.length - 1);
          }

        } else if (printable) {
          cmd += key;
          curTerm.write(key);
        }
      });
    }
  }); 


  return (
    <div className="App">
      <div id="terminal" ref={ref}></div>
    </div>
  );
}

export default App;

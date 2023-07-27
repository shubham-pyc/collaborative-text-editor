import { useEffect } from 'react';

import 'quill/dist/quill.bubble.css';
// import type from 'rich-text';

import Quill, { DeltaOperation } from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';

//@ts-expect-error
import richText from 'rich-text';

export function App() {
  useEffect(() => {
    // Register datatype to sharedb
    Sharedb.types.register(richText.type);

    // Make connections
    const socket: any = new WebSocket('ws://127.0.0.1:8080');
    const connection = new Sharedb.Connection(socket);

    //Make document instance
    const doc = connection.get('documents', 'firstDocument');

    doc.subscribe(function (err) {
      if (err) throw err;

      //Quill is a document editor which gives me difference
      let quill = new Quill('#online-editor');

      quill.setContents(doc.data);

      quill.on('text-change', function (delta, oldDelta, source) {
        if (source !== 'user') return;
        doc.submitOp(delta, { source: quill });
      });

      /** listening to changes in the document
       * that is coming from our server
       */
      doc.on('op', function (op: any, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    });
    return () => {
      connection.close();
    };
  }, []);

  return (
    <>
      <h1>Online Text Editor</h1>
      <div className="container">
        <div id="online-editor"></div>
      </div>
    </>
  );
}

export default App;

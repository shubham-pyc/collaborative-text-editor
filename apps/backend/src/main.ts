import WebSocket from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import ShareDB from 'sharedb';
import { type } from 'rich-text';

// Quill editor has a rich text datatype
//Making sharedb compitable with qill editor
ShareDB.types.register(type);

// Making ShareDB instance
const shareDBServer = new ShareDB();
const connection = shareDBServer.connect();

// Making this first document name
const doc = connection.get('documents', 'firstDocument');

doc.fetch(function (err) {
  if (err) throw err;
  if (doc.type === null) {
    //Create a new document and add some text to this
    doc.create([{ insert: 'Jenni is awesome!' }], 'rich-text', () => {
      const wss = new WebSocket.Server({ port: 8080 });

      wss.on('connection', function connection(ws) {
        // For transport we are using a ws JSON stream for communication
        // that can read and write js objects.
        const jsonStream = new WebSocketJSONStream(ws);
        try {
          shareDBServer.listen(jsonStream);
        } catch (error) {
          console.warn(error);
        }
      });
    });
    return;
  }
});

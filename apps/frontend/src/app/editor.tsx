import { useCallback, useEffect, useRef } from 'react';

// import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
// import type from 'rich-text';

import Quill, { DeltaOperation } from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';

//@ts-expect-error
import richText from 'rich-text';
import { useParams } from 'react-router-dom';
import { wrap } from 'module';

Sharedb.types.register(richText.type);


function makeConnection(documentId:string, ref:any){
  

    // Make connections
    const socket: any = new WebSocket('ws://127.0.0.1:8080');
    const connection = new Sharedb.Connection(socket);

    //Make document instance
    const doc = connection.get('documents', documentId );

    doc.subscribe(function (err) {
      if (err) throw err;

      //Quill is a document editor which gives me difference
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],  // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        // array for drop-downs, empty array = defaults
        [{ 'size': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['image', 'video'],
        ['clean']                                         // remove formatting button
      ];

      let div = document.createElement('div');
      ref.append(div);
      let quill = new Quill(div,{
        modules: {
          toolbar: toolbarOptions,
          
          history: {
            userOnly: true  // only user changes will be undone or redone.
          }
        },
        theme: "snow"
      });


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
    return connection;
}

export function Editor() {
  let { uuid } = useParams();
  let value = uuid ? uuid: "default";
  // let wrapperRef = useRef();
  let wrapperRef = useCallback((wrapper:any) => {
    if(wrapper == null) return;
    wrapper.innertHTML = "";
    // Register datatype to sharedb
    async function makeDocument():  Promise<void>{
      let connection;
      debugger;
      let res = await fetch("http://localhost:3000/create/"+value);
      // res = await res.json();
      if(res.status === 201){
        debugger;
        connection = makeConnection(value, wrapper)
      }else{
        console.warn("Checking this");
      }
    }

    makeDocument();

  }, []);

  return (
    <>
      <h1>Online Text Editor</h1>
      <div className="container" ref={wrapperRef}>
        {/* <div id="online-editor"></div> */}
      </div>
    </>
  );
}

export default Editor;

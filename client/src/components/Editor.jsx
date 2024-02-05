import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import snow theme styles
import {io} from 'socket.io-client';
import SERVER_URL from '../../configure';
import { useParams } from 'react-router-dom';

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],        // remove formatting button     
];

const SAVE_INTERVAL_TIME = 2000;
const Editor = () => {
  const [value, setValue] = useState('');
  const [socket,setSocket]=useState()
  const [title,setTitle]=useState('untitled document')
  const {id:documentId} = useParams();

  // set up socket
  useEffect(()=>{
    const s=io(`${SERVER_URL}`);
    setSocket(s)

    return ()=>{
      s.disconnect();
    }
  },[])



  // Load documents
  useEffect(()=>{
    if(socket==null)return
    socket.on('load-document',document=>{
      setTitle(document.title)
      setValue(document.data)
    })
    
    socket.emit('get-document',documentId)

    return () => {
      socket.off('load-document', handleLoadDocument);
    };
  },[socket,documentId])



// Receive changes
useEffect(() => {
  const handleReceiveChanges = ({ content, delta }) => {
    console.log('receive-changes', content);
    setValue((prevValue) => {
      console.log('value after', prevValue);
      return content;
    });
  };

  if (socket) {
    socket.on('receive-changes', handleReceiveChanges);
  }

  return () => {
    if (socket) {
      socket.off('receive-changes', handleReceiveChanges);
    }
  };
}, [socket, value]);




// Save document
useEffect(() => {
  const handleSave = () => {
    console.log('save-document', value);
    socket.emit('save-document', value);
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [socket, value]);




 // Handle changes
 const handleChange = (content, delta, source, editor) => {
  if (source === 'user') {
    socket.emit('send-changes', { content, delta });
  }
  setValue(content);
};

  return (
    <div className='container'>
      <h1 className='title-bar'>{title}</h1>
      <ReactQuill
        modules={{ toolbar: toolbarOptions }}
        value={value}
        onChange={handleChange}
        theme='snow'
      />
      <p>NOTE: Press Ctrl+S to save document</p>
    </div>
  );
};

export default Editor;

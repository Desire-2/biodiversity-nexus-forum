import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ initialValue, onChange }) => {
  const [content, setContent] = useState(initialValue);

  const handleEditorChange = (e) => {
    setContent(e.target.getContent());
    onChange(e.target.getContent());
  };

  return (
    <Editor
      initialValue={content}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
      }}
      onChange={handleEditorChange}
    />
  );
};

export default RichTextEditor;

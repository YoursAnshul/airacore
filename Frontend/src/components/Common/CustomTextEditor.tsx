// import './CustomTextEditor.scss';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; 

interface EditorData {
    data: any;
    editedData: any;
}
 
 
const CustomTextEditor = (props: EditorData) => {
    const [message, setMessage] = useState<any>();
 
    useEffect(() => {
        setMessage(props.data);
    }, [props.data]);
 
    return (
        <>
            <div className='parent-editor'>
                <CKEditor
                    editor={ClassicEditor}
                    // config={props.emailType == 'TERMS' ? {} : editorConfiguration}
                    data={message}
                    onChange={(event: any, editor: any) => {
                        const data = editor.getData();
                        setMessage(data);
                        props.editedData(data);
                    }}
                />
            </div>
        </>
    )
}
 
export default CustomTextEditor;
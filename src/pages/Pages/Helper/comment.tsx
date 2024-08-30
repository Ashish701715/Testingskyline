import { useState } from "react";
import "./style.css";
import "flatpickr/dist/flatpickr.css";
import "react-phone-number-input/style.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@mui/joy/FormControl';
import {Button, Divider} from "@nextui-org/react";
import {  useParams} from "react-router-dom";
import { INSERTDATA } from "../../../APIurl/url";
import { generateJWT } from "../../JWT";
import Chip from '@mui/material/Chip';
import Swal from 'sweetalert2';
import {Socket} from '../../../server/server';

export default function App() {
  const [editorData, setEditorData] = useState('');
  const { FormID } = useParams();
  const { EncryptId } = useParams();
  const { SerialId } = useParams();
  const [isLoading , setLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const handleEditorChange = (event:any, editor:any) => {
    const data = editor.getData();
    setEditorData(data);
  };
  const [file, setFile] = useState(null);
  const AddCommentHandle = (event:any) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('PAGE_REQUEST', 'ADD_COMMENT_PAGE');
    if (FormID) formData.append('FormID', FormID);
    if (SerialId) formData.append('SerialId', SerialId);
    if (EncryptId) formData.append('EncryptId', EncryptId);
    formData.append('COMMENT_MESSAGE', editorData || '');
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);

    token.then((JwtToken) => {
      fetch(INSERTDATA, {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
        },
        body: formData
      })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === true) {
          Swal.fire({
            icon: 'success',
            title: data.message,
            padding: '2em',
            customClass: 'sweet-alerts',
          }).then((result) => {
            if (result && result.isConfirmed) {
              setShowFileUpload(false);
              const form = document.getElementById("FomrId") as HTMLFormElement;
              if (form) {
                form.reset();
                setEditorData('');
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: data.message,
            padding: '2em',
            customClass: 'sweet-alerts',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: err,
          padding: '2em',
          customClass: 'sweet-alerts',
        });
      });
    })
    .catch((err) => {
      setLoading(false)
      Swal.fire({
        icon: 'error',
        title: err,
        padding: '2em',
        customClass: 'sweet-alerts',
      });
    });
  }
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  
  const handleFileChange = (file:any) => {
      setFile(file);
  };

  const toggleFileUpload = () => {
      setShowFileUpload(!showFileUpload);
  };

  return (
    <>
      <form onSubmit={AddCommentHandle} id='FomrId' encType="multipart/form-data">
        <FormControl>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={handleEditorChange}
          />
          <input type="hidden" name="COMMENT_MESSAGE" value={editorData} />
         

          {showFileUpload &&  
           <div className="mt-5 border-1 p-2">
            <input type="file" name="File" />
           </div>
          }

          <Divider className='mt-3 mb-3'/>
          <div className="button">
            {(isLoading)?(
                <Button color="primary" type="submit" className="ml-2 mr-2" variant="solid" isDisabled={isLoading} size='sm'>Please Wait...</Button>
            ):(
               <Button color="primary" type="submit" className="ml-2 mr-2" variant="solid" isDisabled={isLoading} size='sm'>SAVE</Button>
            )}
            <Button  color="primary" className="ml-2 mr-2" variant="faded" size='sm'>CANCEL</Button>
          </div>   
        </FormControl>
      </form>   
    </>
  );
}

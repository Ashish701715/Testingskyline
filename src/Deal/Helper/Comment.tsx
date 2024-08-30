import React, { useState, ChangeEvent, FormEvent } from "react";
import "flatpickr/dist/flatpickr.css";
import "react-phone-number-input/style.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@mui/joy/FormControl';
import { Button, Divider } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { INSERTDATA } from "../../APIurl/url";
import { generateJWT } from "../../pages/JWT";
import Swal from 'sweetalert2';

const App: React.FC = () => {
  const [editorData, setEditorData] = useState<string>('');
  const { deal_id } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);

    const handleEditorChange = (event: any, editor: any) => {
        const newData = editor.getData();
        setEditorData(newData);
    };

  const AddCommentHandle = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let AuthToken = localStorage.getItem('auth_token');
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append('PAGE_REQUEST', 'ADD_DEAL__PAGE_COMMENT');
    formData.append('COMMENT_MESSAGE', editorData || '');
    formData.append('CREATE_BY', AuthToken || '' );
    formData.append('DEAL_ID', deal_id || '' );

    try {
      const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
      const secretKey = "JwtSecret";
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
      const token = await generateJWT(payload, secretKey, expiresIn);

      const res = await fetch(INSERTDATA + '?Insert=true&data=deal', {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${token}`,
          'x-crros-access': 'true',
          'x-token-access': 'true',
        },
        body: formData
      });
      const data = await res.json();

      if (data.status === true) {
        Swal.fire({
          icon: 'success',
          title: data.message,
          padding: '2em',
          customClass: 'sweet-alerts',
        }).then((result) => {
          if (result && result.isConfirmed) {
            setShowFileUpload(false);
            const form = document.getElementById("FomrId");
            if (form) {
              (form as HTMLFormElement).reset();
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
    } catch (err) {
        console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
            onChange={(event, editor) => handleEditorChange(event, editor)}
          />
          <input type="hidden" name="COMMENT_MESSAGE" value={editorData} />

          {showFileUpload &&  
            <div className="mt-5 border-1 p-2">
              <input type="file" name="File" />
            </div>
          }

          <Divider className='mt-3 mb-3' />
          <div className="button">
            <Button
              color="primary"
              type="submit"
              className="ml-2 mr-2"
              variant="solid"
              isDisabled={isLoading}
              size='sm'
            >
              {isLoading ? "Please Wait..." : "SAVE"}
            </Button>
            <Button
              color="primary"
              className="ml-2 mr-2"
              variant="faded"
              size='sm'
              onClick={() => setShowFileUpload(false)}
            >
              CANCEL
            </Button>
          </div>
        </FormControl>
      </form>
    </>
  );
}

export default App;

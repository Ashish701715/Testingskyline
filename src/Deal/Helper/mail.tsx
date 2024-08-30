import React , {useState} from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/button";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { GOOGLEMAIL } from "../../APIurl/url";
import { generateJWT } from "../../pages/JWT";
import Swal from 'sweetalert2'
export default function App() {
    const [text, setText] = useState<string>('');
    const [loader , setLoader] = useState(false);
    async function handleEmailhandler(event: any) {
      setLoader(true);
      event.preventDefault();
      const Formdata =  new FormData(event.target);
      const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
      const secretKey = "JwtSecret";
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
      Formdata.append('PAGE_REQUEST', 'GET_DEAL_PAGE_EMAIL');
      Formdata.append('mailbody', text);
      const token = await generateJWT(payload, secretKey, expiresIn);
      try {
          const response = await fetch(GOOGLEMAIL + '?action=get-deal-email&auth=true&view=true&edit=false', {
              method: "POST",
              headers: {
                  "Authenticate": `Bearer ${token}`,
              },
              body: Formdata
          });
          const responseData = await response.json();
          if(responseData.status==true)
            {
              // blank and reset values
              event.target.reset();
              setText('');
              // end blnk form values
              setLoader(false);
              Swal.fire({
                title: responseData.message,
                icon: "success"
              });
            }else{
              setLoader(false);
              Swal.fire({
                title: responseData.message,
                icon: "error"
              });
            }
      } catch (error) {
          setLoader(false);
          console.error('Error fetching data:', error);
      }
    }

  return (
    <Card className="max-w-[100%] mr-3 font-sans">
      <form onSubmit={handleEmailhandler}>
          <CardHeader className="flex">
              <div className="flex flex-col">
                <p className="text-xl">Send Message: </p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
            
            <table style={{marginBottom:'10px'}}>
              <tr>
                <th className="w-[15px]">
                  <span className="font-semibold"> To: </span>
                </th>
                <td>
                  <input type="text" placeholder="Add recipient" name="recipient" className="form-input" required />
                </td>
              </tr>
              <tr >
                <th className="">
                  <span className="font-semibold"> Subject: </span>
                </th>
                <td>
                  <input type="text" placeholder="Enter Subject" name="subject" className="form-input" required />
                </td>
              </tr>
            </table>

              <div className="card">
                  <Editor value={text} name="TextEditor" onTextChange={(e) => setText(e.htmlValue || '')} style={{ height: '320px' }} />
              </div>

            </CardBody>
            <Divider/>
            <CardFooter>
              {(loader)? (
                <Button style={{background:'#f5a524'}} isDisabled type="button">please wait...</Button>
              ):(
                <Button style={{background:'#f5a524'}} type="submit">SEND</Button>
              )}
             
            </CardFooter>
      </form>
    </Card>
  );
}

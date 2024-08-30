import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Select, Space } from 'antd';
import { Editor } from 'primereact/editor';
import { Kbd } from '@nextui-org/react';
import { INSERTDATA } from '../../../APIurl/url';
import serversidetoken from '../../../getLoggedUser/GetUserInfomation';
import Swal from 'sweetalert2';
interface FileTransferModalProps {
    setTransferFile: React.Dispatch<React.SetStateAction<boolean>>;
    isfileTransferInfo: any;
}
const App: React.FC<FileTransferModalProps> = ({ setTransferFile, isfileTransferInfo }) => {
    // handle Transfer File Function And Server Side Send Request Function execute
    const [primaryCountry, setPrimaryCountry] = useState();
    function PrimaryCountry(e: any) {
        setPrimaryCountry(e);
    }
    const [text, setText] = useState('');
    const jwt = serversidetoken('jwt');
    const [loader , setLoader] = useState(false);
    async function handletransferfile(e: any) {
        e.preventDefault();
        setLoader(true);
        const formData = new FormData(e.target);
        const fileId = formData.get('FileTransfer[fileId]');
        const fileUUID = formData.get('FileTransfer[FileUUID]');
        const checkBox = formData.get('FileTransfer[checkBox]');
        const res = await fetch(INSERTDATA + '?action=fileTransfer&fileTransfer=true&isAgree=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authenticate: `Bearer ${jwt}`,
                'x-crros-access': 'true',
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'STUDENT_FILE_TRANSFER_STAFF',
                message: text,
                fileId: fileId,
                fileUUID: fileUUID,
                checkBox: checkBox,
                PrimaryCuntry: primaryCountry,
            }),
        });
        const data = await res.json();
        setLoader(false);
        if (data.status === true) {
             //this session help load data other page inside  
             sessionStorage.setItem('studentdataloader', 'true');
             
            Swal.fire({
                text: data.message,
                icon: 'success',
            }).then(()=>{
                const formElement = e.target.closest('form');
                if (formElement) {
                    formElement.reset();
                    setText('');
                }
            })
        } else if (data.status === false) {
            Swal.fire({
                text: data.message,
                icon: 'error',
            });
        }else{
            Swal.fire({
                text: 'Error Query Please Refresh Page And Try Again',
                icon: 'error',
            });
        }
    }

    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(true);
    }, [setTransferFile]);
    const onClose = () => {
        setOpen(false);
        setTimeout(() => {
            setTransferFile(false);
        }, 500);
    };
    const renderHeader = () => {
        return (
            <ul className="flex">
                <li className="ml-2">
                    <Kbd keys={['command']}>
                        <b>Bold</b> ctrl+B
                    </Kbd>
                </li>
                <li className="ml-2">
                    <Kbd keys={['command']}>
                        <b>Italic</b> ctrl+i
                    </Kbd>
                </li>
                <li className="ml-2">
                    <Kbd keys={['command']}>
                        <b>Underline</b> ctrl+U
                    </Kbd>
                </li>
            </ul>
        );
    };

    const CountryServices: any = [];
    let array = JSON.parse(isfileTransferInfo.SERVICES_COUNTRY);
    array.map((value: any, index: number) => {
        CountryServices.push(value['COUNTRY_NAME']);
    });
    const header = renderHeader();
    return (
        <>
            <Drawer
                className="font-Poppins"
                title="File Sharing and Collaboration for Staff Teams"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <form onSubmit={handletransferfile}>
                    {array.length > 1 && (
                        <>
                            <span className="mb-2 text-red-400">Note: Select Primary Country * </span>
                            <label htmlFor="" className="mt-2">
                                Transfer Data:{' '}
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                options={CountryServices.map((value: any, index: any) => ({ label: value, value: value }))}
                                onChange={PrimaryCountry}
                                value={primaryCountry}
                            />
                        </>
                    )}

                    <label htmlFor="message" className="font-Poppins">
                        Comment <span className="text-red-500">*</span>
                    </label>
                    <Editor value={text} onTextChange={(e: any) => setText(e.htmlValue)} style={{ height: '320px' }} headerTemplate={header} required id="message" />
                    <input type="hidden" value={isfileTransferInfo.ID} name="FileTransfer[fileId]" required readOnly />
                    <input type="hidden" value={isfileTransferInfo.CLIENT_ID} name="FileTransfer[FileUUID]" required readOnly />

                    <div className="note flex">
                        <input type="checkbox" name="FileTransfer[checkBox]" required />
                        <span className="ml-2 font-Poppins">transfer file </span>
                    </div>

                    {/* Handler Button  */}
                    <div className="bg-bule">
                        <Space className="FormButtonSetupCss">
                            <Button onClick={onClose} className="font-Poppins">
                                Cancel
                            </Button>
                            <button className="bg-color-blue font-Poppins" type={(loader) ? 'button' : 'submit' } disabled={loader}>
                             {(loader) ? 'process form request...' : 'submit'}
                            </button>
                        </Space>
                    </div>
                </form>
            </Drawer>
        </>
    );
};

export default App;

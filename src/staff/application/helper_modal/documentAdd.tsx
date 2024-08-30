import React, { useState, useEffect } from 'react';
import { Checkbox, Drawer, Space } from 'antd';
import type { DrawerProps } from 'antd';
import { GETDATA } from '../../../APIurl/url';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { INSERTDATA } from '../../../APIurl/url';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, ButtonGroup } from '@nextui-org/button';
/**
 * DocumentRequire component
 *
 * This component displays a button to open a large drawer containing a list of documents.
 * The list of documents is fetched from the API using the `GETDATA` URL and the `jwt` token.
 *
 * @example
 * ```jsx
 * import DocumentRequire from './DocumentRequire';
 *
 * const App = () => {
 *   return <DocumentRequire />;
 * };
 * ```
 */
const DocumentRequire: React.FC = () => {
    /**
     * State to track whether the drawer is open or not
     */
    const [open, setOpen] = useState(false);

    /**
     * State to track the size of the drawer
     */
    const [size, setSize] = useState<DrawerProps['size']>();

    /**
     * Function to show the large drawer
     */
    const showLargeDrawer = () => {
        setSize('large');
        setOpen(true);
    };

    /**
     * Function to close the drawer
     */
    const onClose = () => {
        setOpen(false);
    };

    /**
     * Get the JWT token from the `jwt` module
     */
    const Token = jwt('jwt');

    /**
     * State to store the list of documents
     */
    const [DocumentList, setDocumentList] = useState([]);

    /**
     * Function to fetch the list of documents from the API
     *
     * @returns {Promise<void>}
     */
    const GetDocuList = async () => {
        const requester = await fetch(GETDATA + '?action=getDocList', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
                'x-token-access': `true`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_DOCUMENT_LIST_DATA',
            }),
        });
        const res = await requester.json();
        if (res.status === true && res.data.length > 0) {
            setDocumentList(res.data);
        } else {
            setDocumentList([]);
        }
    };
    /**
     * Use effect to fetch the list of documents when the component mounts
     */
    useEffect(() => {
        GetDocuList();
    }, []);

    const [loader, setLoader] = useState(false);
    const { client_id } = useParams();
    const handleDocumentRequirement = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        const target = e.target;
        const fornData = new FormData(target);
        fornData.append('PAGE_REQUEST', 'INSERT_DOCUMENT_REQUEST_DATA');
        fornData.append('ClientId', client_id || '');
        const insertdata = await fetch('https://boostupinfinity.in/CRM/API/V1/ajax.insert.php?action=insertDoc' + '?action=insertDoc', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
            },
            body: fornData,
        });
        const res = await insertdata.json();
        if (res.status === true) {
            setLoader(false);
            Swal.fire({
                text: res.message,
                icon: 'success',
            }).then(() => {
                sessionStorage.setItem('documentStore', 'true');
                setOpen(false);
            });
        } else {
            setLoader(false);
            Swal.fire({
                text: res.message,
                icon: 'error',
            });
        }
    };
    return (
        <>
            <Space>
                <button className="btn btn-primary  mb-1" onClick={showLargeDrawer}>
                    Required New Document
                </button>
            </Space>
            <Drawer title="Document Requirement" className="font-Nunito" placement="left" size={size} onClose={onClose} open={open}>
                <form onSubmit={handleDocumentRequirement}>
                    <div className="table-responsive table-height-scroll">
                        <table className="table-res table-fixed">
                            <thead className="">
                                <tr>
                                    <th>#</th>
                                    <th className="font-Nunito">Document Name</th>
                                    <th className="font-Nunito">Document Require</th>
                                </tr>
                            </thead>
                            <tbody>
                                <input type="hidden" name="STUDENT_ID" value={32} />
                                {DocumentList.map((item: any, index) => (
                                    <tr key={index}>
                                        <input type="hidden" name="DOCUMENTID[]" value={item.ID} />
                                        <input type="hidden" name="DOCUMENTUUID[]" value={item.DOC_ID} />
                                        <td>
                                            <Checkbox name="IS_selectedDoc[]" value={item.ID}></Checkbox>
                                        </td>
                                        <td>
                                            <span className="font-Nunito font-bold">{item.DOCUMENT_NAME}</span>
                                            <br></br>
                                            <span className='font-description'>{item.DOCUMENT_INFOMATION}</span>
                                        </td>
                                        <td>
                                            <Checkbox name="IS_requireDoc[]"></Checkbox>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Space className="bottom-fix">
                        <Button className="btn btn-danger font-Nunito" type="button" onClick={onClose}>
                            CLOSE
                        </Button>
                        {loader ? (
                            <Button className="btn hover-none font-Nunito" type="button" isLoading>
                                Please wait...
                            </Button>
                        ) : (
                            <Button className="btn hover-none font-Nunito" type="submit">
                                SEND DOCUMENT LIST
                            </Button>
                        )}
                    </Space>
                </form>
            </Drawer>
        </>
    );
};

export default DocumentRequire;

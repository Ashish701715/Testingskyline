import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { InsertAction } from '../../../FormHandler/InsertAction';
import { university_Api } from '../../../APIurl/url';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import type { RcFile } from 'antd/es/upload/interface';
interface ImageType {
    imageData: any;
    setrefresh: any;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const App: React.FC<ImageType> = ({ imageData, setrefresh }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    React.useEffect(() => {
        if (imageData !== null) {
            const image_data = JSON.parse(imageData);
            const newFileList = image_data.map((value: any, index: number) => ({
                uid: value.IMAGE_URL,
                name: 'university.png',
                status: 'done',
                url: `https://boostupinfinity.in/CRM/API/V1/V1/image.ajax.php?fileId=${value.IMAGE_URL}`,
            }));
            setFileList(newFileList);
        }
    }, [imageData]);
    const { programId } = useParams();
    const jwttoken = jwt('jwt');
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        const removedFiles = fileList.filter((file) => !newFileList.some((newFile) => newFile.uid === file.uid));

        // Handle removed files
        if (removedFiles.length > 0) {
            const body = JSON.stringify({
                PAGE_REQUEST: 'PROGRAM_IMAGE_UPLOAD_REMOVE',
                DATA: removedFiles,
            });
            const Header = {
                Authenticate: `Bearer ${jwttoken}`,
            };
            const Response = await InsertAction(university_Api, body, 'POST', Header);
            if (Response.status === true) {
                Swal.fire({
                    text: Response.message,
                    icon: 'success',
                }).then(() => {
                    setrefresh(true);
                });
            } else {
                Swal.fire({
                    text: Response.message,
                    icon: 'error',
                });
            }
        } else {
            const body = new FormData();
            body.append('PAGE_REQUEST', 'PROGRAM_IMAGE_UPLOAD_ACTION');

            body.append('PROGRAM_ID', programId ? programId : '0');
            newFileList.forEach((file) => {
                body.append('IMAGE_DATA', file.originFileObj as RcFile);
            });

            const Header = {
                Authenticate: `Bearer ${jwttoken}`,
            };
            const Response = await InsertAction(university_Api, body, 'POST', Header);
            if (Response.status === true) {
                Swal.fire({
                    text: Response.message,
                    icon: 'success',
                }).then(() => {
                    setrefresh(true);
                });
            } else {
                Swal.fire({
                    text: Response.message,
                    icon: 'error',
                });
            }
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <>
            <Upload listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
                {fileList.length >= 10 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    className="small_img"
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default App;

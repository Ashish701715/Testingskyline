import React, { useState } from 'react';
import { FileUpload as PrimeFileUpload } from 'primereact/fileupload';
import "primereact/resources/themes/lara-light-cyan/theme.css";

interface FileUploadProps {
    onChange: (file: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileUpload = (event: any) => {
        setSelectedFiles([...event.files]);
        onChange([...event.files]);
    };

    return (
        <PrimeFileUpload 
            name="demo[]"   
            accept="image/*" 
            maxFileSize={1000000} 
            className='background-black' 
            onSelect={handleFileUpload} 
        />
    )
}

export default FileUpload;

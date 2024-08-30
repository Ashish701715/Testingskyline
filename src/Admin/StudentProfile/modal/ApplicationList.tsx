import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button,Drawer, Space } from 'antd';
interface AppProps {
    setviewapplication: Dispatch<SetStateAction<boolean>>;
}
const App: React.FC<AppProps> = ({ setviewapplication: setParentOpen }) => {
    const [open, setOpenState] = useState(true);
    const onClose = () => {
        setOpenState(false);
        setTimeout(()=>{
          setParentOpen(false);
        },500)
    };
    return (
        <>
            <Drawer
                title="Application"
                width={'80%'}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose} className="btn-danger h:btn-danger">
                            Close
                        </Button>
                    </Space>
                }
            >
          
            </Drawer>
        </>
    );
};

export default App;

import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import ViewProgram from '../cources_view';

interface ProgramInfoType
{
  programinfo:any
}

const App: React.FC <ProgramInfoType> = ({programinfo}) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
     <Button className="create-application-custom" onClick={showDrawer}>Create Application</Button>
      <Drawer title="New Program Enroll" onClose={onClose} open={open} width={'90%'} className='new-header-class'>
        <ViewProgram programinfomation={programinfo}/>
      </Drawer>
    </>
  );
};

export default App;
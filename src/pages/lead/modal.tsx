import React, { useState ,FormEvent } from 'react';
import { Drawer, Space } from 'antd';
import {Tabs, Tab,  Button} from "@nextui-org/react";
import {PlusIcon} from "./PlusIcon";
 import Form_data from './form';
const App = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  

  return (
    <>
      <Button  onClick={showDrawer} size="sm"  className="text-black" > <PlusIcon /> New Lead</Button>
      <Drawer
        title="CREAET A NEW LEAD"
        width={550}
        placement='left'
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button color="danger" size='md' onPress={onClose}>
              CLOSE
            </Button>
            <Button color="primary"size='md' type='submit'>
              NEW LEAD
            </Button>
          </Space>
        }
      >
        <div className="flex w-full flex-col">
              <Tabs aria-label="Options">
              <Tab key="visa_tab" title="Visa lead" id="ViewLeadForm">
                <h4>Visa lead</h4>
                <Form_data />
              </Tab>

              <Tab key="music" title="Study Visa Lead" id="ViewStudyLeadForm">
              <h4>Study Visa Lead</h4>
                <Form_data />
              </Tab>

              <Tab key="videos" title="Visitor Visa Lead" id="ViewVisitorLeadForm">
              <h4>Visitor Visa Lead</h4>
                <Form_data />
              </Tab>

              </Tabs>
        </div> 
      </Drawer>
    </>
  );
};

export default App;
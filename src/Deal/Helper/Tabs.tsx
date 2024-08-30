import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

export default function App() {
  return (
    <>
      <ul className="flex mt-3 mb-2">
        <li>
          <div className="flex flex-wrap gap-4 mr-2 bg-green">
            <Tabs key="default" aria-label="Tabs colors" radius="full" disabledKeys={["List", "Calender"]} >
              <Tab key="photos" className="text-white" title="Karban" />
              <Tab key="List" title="List" />
              <Tab key="Calender" title="Calender" />
              {/* <Tab key="Activities" title="Activities" /> */}
            </Tabs>
          </div>
        </li>
      </ul>
    </>
  );
}

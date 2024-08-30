import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ApplicationList from "./Application";
import Leadtable from "../StaffDeal/Dealtable";
export default function App() {
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
                <Tab key="Aplications" title="Aplications Request">

                    <ApplicationList />

                </Tab>
                <Tab key="Lead" title="Lead">

                    <Leadtable />
                </Tab>

            </Tabs>
        </div>
    );
}

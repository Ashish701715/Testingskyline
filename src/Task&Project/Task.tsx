import React, { Suspense, lazy } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./Task_style.css";
import { Tabs, Tab } from "@nextui-org/react";
import Createtask from './Createtask';
import { Card } from "@mui/material";

const Tasklist = lazy(() => import("./API_HELPER/Task_list"));
const Karban = lazy(() => import("./API_HELPER/Task_Karban"));
const Calendar = lazy(() => import("./API_HELPER/Calendar"));
export default function Task() {
    const { TabsnameID } = useParams();

    return (
        <>

            <ul className="header flex justify-between mt-5 mb-5 background-blue">
                <li>
                    <div className="flex flex-wrap gap-4 mr-2 background-check">
                        <Tabs key="default" className="checkoing" aria-label="Tabs colors"radius="full" selectedKey={TabsnameID}>
                            <Tab key="list" title="List" className="tab-bg-blue " href="list" />
                            <Tab key="deadline" title="Deadline" className="tab-bg-blue" href="deadline" />
                            <Tab key="calender" title="Calender" className="tab-bg-blue" href="calender" />
                            <Tab key="activities" className="tab-bg-blue" title="Activities" />
                        </Tabs>
                    </div>
                </li>

                <li>
                    <Createtask />
                </li>
            </ul>

            <Suspense fallback={<div>Loading...</div>}>
                {TabsnameID === "list" && <Card className="p-5"><Tasklist /></Card>}
                {TabsnameID === "deadline" && <Karban />}
                {TabsnameID === "calender" && <Calendar />}
            </Suspense>
        </>
    )
}

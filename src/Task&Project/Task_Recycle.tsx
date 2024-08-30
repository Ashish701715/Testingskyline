import React, { Suspense, lazy } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./Task_style.css";
import { Tabs, Tab } from "@nextui-org/react";
import Createtask from './Createtask';
import { Card } from "@mui/material";

import TASKRCYCLE from "./API_HELPER/ListRcycleBin";
export default function Task() {
    const { TabsnameID } = useParams();

    return (
        <>
            <div className="flex flex-wrap gap-12 card-white">
                <ul className="list" id="table-list">
                    <li className="list-name font-medium text-lg-200" title="Task">
                        Task
                    </li>
                    <li className="list-name font-thin font-medium text-lg-200" title="Project">
                        Project
                    </li>
                    <li className="list-name font-thin font-medium text-lg-200" title="Efficiency">
                        Efficiency
                    </li>
                    <li className="list-name font-thin font-medium text-lg-200" title="Recycle Bin">
                        Recycle Bin
                    </li>
                </ul>
            </div>

            <div className="mt-10">
                <Card className="p-4">
                    <TASKRCYCLE />
                </Card>
            </div>

        </>
    )
}
import React from "react";
import { User } from "@nextui-org/user";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
interface SubtaskProps {
    subtaskData: any[]; // Define the type of subtaskData
}

function Subtask({ subtaskData }: SubtaskProps) {
    const getKeyValue = (item: any, columnKey: string) => {
        switch (columnKey) {

            case "TASKID":
                return (
                    <>
                        # {item[columnKey]}
                    </>


                );
            case "create_user":
                return (
                    <>
                        <User
                            name={JSON.parse(item.create_user).CLIENT_NAME}
                            description="Task created"
                            avatarProps={{
                                src: (JSON.parse(item.create_user).PROFILE_URL)
                            }}
                        />
                    </>


                );

            case "Assignee":
                return (
                    <>
                        <User
                            name={JSON.parse(item.assigned).CLIENT_NAME}
                            description="Assignee created"
                            avatarProps={{
                                src: (JSON.parse(item.assigned).PROFILE_URL)
                            }}
                        />
                    </>


                );

            default:
                return item[columnKey];
        }
    };

    // Define columns for the table
    const columns = [
        { key: 'TASKID', label: 'Task ID' },
        { key: 'TITLE', label: 'Title' },
        { key: 'PRIORITY', label: 'PRIORITY' },
        { key: 'DEADLINE', label: 'DEADLINE' },
        { key: 'CREATE_AT', label: 'CREATED AT' },
        { key: 'create_user', label: 'CREATE USER' },
        { key: 'Assignee', label: 'ASSIGNEE USER' },

        { key: 'ASSIGNED_DATE', label: 'ASSIGNEE DATE' },
        // Add more columns as needed
    ];



    return (
        <Table aria-label="Subtask Table">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={subtaskData}>
                {(item) => (
                    <TableRow key={item.TASKID}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {getKeyValue(item, column.key)}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
export default Subtask;

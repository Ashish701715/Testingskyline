import React, { useState } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Textarea, Button } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from "@nextui-org/react";
import { generateJWT } from '../../pages/JWT';
import { TASKAPI } from '../../APIurl/url';
interface TaskHistoryProps {
    History: any[]; // Assuming History is an array of strings
    Comment: any[];
    Taskdata: any[];// Assuming Comment is an array of strings
}
const TaskHistory: React.FC<TaskHistoryProps> = ({ History, Comment, Taskdata }) => {
    const [Isfeedform, setfeedform] = useState(true);
    const [loader, Setloader] = useState(false);
    const authTokenLocalStorage = localStorage.getItem('auth_token');
    const USERID = localStorage.getItem('SID');
    const TASK_ID = Taskdata[0]["TASKID"];
    const TASK_TOKEN_ID = Taskdata[0]["TASKTOKEN"];
    const [taskComment, setTaskComment] = useState("");
    const Taskcomment = (e: any) => {
        e.preventDefault();
        Setloader(true);
        const payload = { REQUEST: "TASK_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token
            .then((JwtToken) => {

                fetch(TASKAPI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: "INSERT_COMMENTTASK",
                        AUTH_ID: authTokenLocalStorage,
                        TASK_ID: TASK_ID,
                        TASK_TOKEN_ID: TASK_TOKEN_ID,
                        TASK_COMMENT: taskComment
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {

                        if (data.status == true) {
                            setfeedform(true);
                            setTaskComment("");
                            window.location.reload();
                        }
                        else {
                            alert(data.message);
                        }

                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });


    }
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Disabled Options">
                <Tab key="Comment" title="Comment">
                    <Card>
                        <CardBody className="grid gap-4">
                            {Comment.map((commentvalue, index) => (

                                <div style={{ background: 'beige', padding: '10px', borderRadius: '18px' }}>
                                    <User
                                        name={commentvalue.CREATE_USER_NAME}
                                        description={commentvalue.COMMENTEDON}
                                        avatarProps={{
                                            src: (commentvalue.PROFILE_URL)
                                        }}
                                    />
                                    <div className="m-2 text-lg">
                                        {commentvalue.COMMENTTEXT}
                                    </div>
                                </div>
                            ))}
                            {Isfeedform ? (
                                <Textarea label="Comment" minRows={2} placeholder="Enter your Comment" onClick={() => setfeedform(false)} />
                            ) : (
                                <form onSubmit={Taskcomment}>
                                    <div className="feedform grid gap-4">

                                        <Textarea
                                            label="Enter your Comment"
                                            name="TASK_COMMENT"
                                            onChange={(e) => setTaskComment(e.target.value)}
                                        />

                                        <div className="flex gap-4">
                                            {(loader) ? (
                                                <Button color="primary" isLoading>
                                                    processing
                                                </Button>
                                            ) : (
                                                <Button color="primary" variant="solid" type="submit">
                                                    Send
                                                </Button>
                                            )}
                                            <Button color="danger" variant="solid" onClick={() => setfeedform(true)}>
                                                Cancal
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            )
                            }
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="History" title="History">
                    <Card>
                        <CardBody>
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>Date</TableColumn>
                                    <TableColumn>Created By</TableColumn>
                                    <TableColumn>Update Disposition</TableColumn>
                                    <TableColumn>ACTION</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {History.map((item: any) => (
                                        <TableRow key={item.ID}>
                                            <TableCell>{item.CREATED_AT}</TableCell>
                                            <TableCell>{item.CREATE_USER_NAME}</TableCell>
                                            <TableCell>{item.CHANGE_DESCRIPTION}</TableCell>
                                            <TableCell>{item.ACTION}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </CardBody>
                    </Card>
                </Tab>
                {/* <Tab key="Time_elapsed" title="Time elapsed">
                    <Card>
                        <CardBody>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </CardBody>
                    </Card>
                </Tab> */}
            </Tabs>
        </div>
    );
}

export default TaskHistory;

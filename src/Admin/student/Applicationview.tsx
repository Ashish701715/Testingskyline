import React from 'react'
import ApplicationList from "./Applications";
export default function Applicationview() {
    return (
        <>
            <div>
                <ul className="flex justify-between">
                    <li>
                        <h4 className="bold-font-700 font-32px">Student Application</h4>
                    </li>
                    <li>
                        <h4 className="bold-font-700 font-32px">Student Application</h4>
                    </li>
                </ul>
            </div>

            <ApplicationList />
        </>

    )
}

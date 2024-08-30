import React from 'react';

export default function CalculateIntake({ intakeData }: any) {
    const getIntakeMonths = (data: any) => {
        // Check if data is an array
        if (!Array.isArray(data)) {
            console.error('Expected an array, but got:', data);
            return [];
        }

        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based
        const currentDay = currentDate.getDate();

        return data.map((item: any) => {
            const monthMap: Record<number, string> = {
                1: "Jan",
                2: "Feb",
                3: "Mar",
                4: "Apr",
                5: "May",
                6: "Jun",
                7: "Jul",
                8: "Aug",
                9: "Sep",
                10: "Oct",
                11: "Nov",
                12: "Dec",
            };

            let intakeYear = currentYear;
            let submissionYear = currentYear;
            let closingYear = currentYear;

            // Check SUBMISSION month equal to current month
            if (currentMonth === item.APPLICATION_SUBMISSION_MONTH) {
                // Check SUBMISSION_DATE less than current date, if yes, +1 year
                if (currentDay > item.APPLICATION_SUBMISSION_DATE) {
                    currentYear = currentYear + 1;
                }
                submissionYear = currentYear;
            }
            // Check SUBMISSION_MONTH less than current month
            else if (item.APPLICATION_SUBMISSION_MONTH < currentMonth) {
                currentYear = currentYear + 1;
                submissionYear = currentYear;
            } else {
                submissionYear = currentYear;
            }

            // Check current month equal to CLOSING_MONTH
            if (currentMonth === item.APPLICATION_CLOSING_MONTH) {
                // Check current day to CLOSING_DATE
                if (currentDay < item.APPLICATION_CLOSING_DATE) {
                    currentYear = currentYear + 1;
                }
                // Check CLOSING_DATE less than SUBMISSION_DATE
                if (item.APPLICATION_CLOSING_DATE < item.APPLICATION_SUBMISSION_DATE) {
                    currentYear = currentYear + 1;
                }
                closingYear = currentYear;
            } else if (item.APPLICATION_CLOSING_MONTH < currentMonth) {
                if (item.APPLICATION_CLOSING_MONTH < item.APPLICATION_SUBMISSION_MONTH) {
                    currentYear = currentYear + 1;
                }
                closingYear = currentYear;
            } else {
                closingYear = currentYear;
            }

            if (item.PROGRAM_INTAKE_MONTH === currentMonth) {
                intakeYear = currentYear;
            } else if (item.PROGRAM_INTAKE_MONTH < currentMonth) {
                if (item.PROGRAM_INTAKE_MONTH < item.APPLICATION_SUBMISSION_MONTH) {
                    currentYear = currentYear + 1;
                }
                intakeYear = currentYear;
            } else {
                intakeYear = currentYear;
            }

            return {
                intake: `${monthMap[item.PROGRAM_INTAKE_MONTH]} ${intakeYear}`,
                submission: `${monthMap[item.APPLICATION_SUBMISSION_MONTH]} ${submissionYear}`,
                closing: `${monthMap[item.APPLICATION_CLOSING_MONTH]} ${closingYear}`
            };
        });
    };
    const parsedIntakeData = JSON.parse(intakeData);
    const intakeDetails = getIntakeMonths(parsedIntakeData);

    console.log(intakeData);
    return (

        <>
            {
                intakeDetails.map((detail: any, index: any) => (

                    <option value={detail.intake}> {detail.intake}</option>

                ))
            }
        </>
    );
}

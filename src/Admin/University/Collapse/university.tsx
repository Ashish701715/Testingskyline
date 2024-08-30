import React, { useState, useEffect } from "react";
import { Checkbox, Input, Divider, Spinner } from "@nextui-org/react";
import { GetUserAPI } from "../../../APIurl/url";
import generateJWT  from '../../../getLoggedUser/GetUserInfomation';
import './style.css';

interface University {
    ID: number;
    UNIVERISTY_NAME: string;
}

export default function Country() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [university, setUniversity] = useState<University[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        const payload = { useremail: "ashishboostui@gmail.com" };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

        const getUniversityData = async () => {
            setLoaded(true);
            try {
                const JwtToken = await generateJWT('jwt');
                const response = await fetch(GetUserAPI, {
                    method: "POST",
                    body: JSON.stringify({
                        "PAGE_REQUEST": 'get-univeristy-data'
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${JwtToken}`
                    }
                });
                const data = await response.json();
                setUniversity(data.data);
                setLoaded(false);
            } catch (error) {
                console.error(error);
                setLoaded(false);
            }
        };

        getUniversityData();
    }, []);

    const handleShowAll = () => {
        setShowAll(!showAll);
    };

    const handleCheckboxChange = (ID: number) => {
        if (selectedItems.includes(ID)) {
            setSelectedItems(selectedItems.filter(item => item !== ID));
        } else {
            setSelectedItems([...selectedItems, ID]);
        }
    };

    const filteredUniversities = university.filter(university =>
        university.UNIVERISTY_NAME.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsToShow = showAll ? filteredUniversities.length : 3;
    const hiddenCount = filteredUniversities.length - itemsToShow;

    return (
        <>
            <Input
                type="search"
                variant="bordered"
                placeholder="Search University"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Divider className="mb-3 mt-1" />
            <div className="university-list">
                <ul className="university" style={{ position: 'relative'}}>
                    {loaded ? (
                        <div style={{ position: 'absolute', top: '100%', left: '40%', transform: 'translate(0%, 0%)' }}>
                            <Spinner />
                        </div>
                    ) : (
                        filteredUniversities.slice(0, itemsToShow).map(university => (
                            <li key={university.ID} className="mb-5 border-lable">
                                <Checkbox
                                    aria-label={university.UNIVERISTY_NAME}
                                    classNames={{
                                        base: "-m-0 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                        label: "w-full ",
                                    }}
                                    isSelected={selectedItems.includes(university.ID)}
                                    onValueChange={() => handleCheckboxChange(university.ID)}
                                >
                                    <div className="w-full flex justify-between gap-2 text-xs">
                                        {university.UNIVERISTY_NAME}
                                    </div>
                                </Checkbox>
                            </li>
                        ))
                    )}
                </ul>

                {filteredUniversities.length > 3 && (
                    <button onClick={handleShowAll} className="text-blue-500 font-bold">
                        {showAll ? `Show Less (${hiddenCount} hidden)` : `Show ${hiddenCount} More`}
                    </button>
                )}
            </div>
        </>
    );
}

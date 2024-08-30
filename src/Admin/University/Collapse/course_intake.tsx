import React, { useState } from "react";
import { Checkbox } from "@nextui-org/react";
import './style.css';
export default function country()
{    
    
    const [isSelected, setIsSelected] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showAll, setShowAll] = useState(false);
  
    const handleShowAll = () => {
        setShowAll(!showAll);
    };
    const Intake = [
        { "id": 1, "name": "Jan" },
        { "id": 2, "name": "Feb" },
        { "id": 3, "name": "Mar" },
        { "id": 4, "name": "Apr" },
        { "id": 5, "name": "May" },
        { "id": 6, "name": "Jun" },
        { "id": 7, "name": "Jul" },
        { "id": 8, "name": "Aug" },
        { "id": 9, "name": "Sep" },
        { "id": 10, "name": "Oct" },
        { "id": 11, "name": "Nov" },
        { "id": 12, "name": "Dec" }
      ]
      ;
    
    const itemsToShow = showAll ? Intake.length : 3;
    const hiddenCount = Intake.length - itemsToShow;
    return(
        <>
        <div className="country-list">
            <ul className="country">
                {Intake.slice(0, itemsToShow).map(country => (
                <li key={country.id} className="mb-5 border-lable">
                    <Checkbox
                    aria-label={country.name}
                    classNames={{
                        base: "-m-0 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        label: "w-full ",
                    }}
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                    >
                    <div className="w-full flex justify-between gap-2">
                        {country.name}
                    </div>
                    </Checkbox>
                </li>
                ))}
            </ul>
            {Intake.length > 3 && (
                <button onClick={handleShowAll} className="text-blue-500 font-bold">
                {showAll ? `Show Less (${hiddenCount} hidden)` : `Show ${hiddenCount} More`}
                </button>
            )}
            </div>
        </>
    );
}
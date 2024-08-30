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
    const Fees = [
        { id: 1, name: '0 - 3000'},
        { id: 2, name: '3000 - 6000'},
        { id: 3, name: '6000 - 9000'},
        { id: 4, name: '9000 - 12000'},
        { id: 5, name: '12000 - 15000'},
        { id: 6, name: '15000 - 18000'},
        { id: 7, name: 'Greater then 18000'},
    ];
    
    const itemsToShow = showAll ? Fees.length : 3;
    const hiddenCount = Fees.length - itemsToShow;
    return(
        <>
        <div className="country-list">
            <ul className="country" style={{ position: 'relative'}}>
                {Fees.slice(0, itemsToShow).map(country => (
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
            {Fees.length > 3 && (
                <button onClick={handleShowAll} className="text-blue-500 font-bold">
                {showAll ? `Show Less (${hiddenCount} hidden)` : `Show ${hiddenCount} More`}
                </button>
            )}
            </div>
        </>
    );
}
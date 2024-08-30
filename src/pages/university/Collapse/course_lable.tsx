import React, { useState } from "react";
import { ScrollShadow, Input, Divider, Checkbox } from "@nextui-org/react";
import './style.css';
export default function country()
{    
    
    const [isSelected, setIsSelected] = useState(false);
    const [showAll, setShowAll] = useState(false);
  
    const handleShowAll = () => {
        setShowAll(!showAll);
    };
    const CourseLable = [
        { id: 1, name: 'Bachelor'},
        { id: 2, name: 'Bachelors'},
        { id: 3, name: 'Certificate'},
        { id: 4, name: 'Diploma'},
        { id: 5, name: 'Doctoral Studies'},
        { id: 6, name: 'Doctorate'},
        { id: 7, name: 'Master'},
        { id: 8, name: 'Masters'},
        { id: 8, name: 'Other'},
        { id: 8, name: 'PG Diploma'},
        { id: 8, name: 'Postgraduate'},
        { id: 8, name: 'Undergraduate'},
    ];
    
    const itemsToShow = showAll ? CourseLable.length : 3;
    const hiddenCount = CourseLable.length - itemsToShow;
    return(
        <>
        <div className="">
            <ul className="country" style={{ position: 'relative' , marginRight:'0px' }}>
                {CourseLable.slice(0, itemsToShow).map(country => (
                <li key={country.id} className="mb-5 border-lable" >
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
            {CourseLable.length > 3 && (
                <button onClick={handleShowAll} className="text-blue-500 font-bold">
                {showAll ? `Show Less (${hiddenCount} hidden)` : `Show ${hiddenCount} More`}
                </button>
            )}
            </div>
        </>
    );
}
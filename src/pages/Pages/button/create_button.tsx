import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';
import Copy_page from "../Offcanva/Copy_Page";

export default function SplitButton() {
  const [view, setView] = useState(false);

  const handleCreateClick = () => {
    
    if(view==false) {
        setView(true);
    }else{
        setView(false);
        setTimeout(() => {
          setView(true);
        }, 10);
    }
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" aria-label="CREATE">
        <Button onClick={handleCreateClick} className='green-button'>CREATE</Button>
      </ButtonGroup>
      {view && <Copy_page />}
    </React.Fragment>
  );
}

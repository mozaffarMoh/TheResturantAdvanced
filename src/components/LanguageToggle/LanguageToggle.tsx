'use client'
import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const useStyles = makeStyles({
  toggleGroup: {
    direction: 'ltr',
    backgroundColor: '#f2f2f2 ',
    borderRadius: '50px',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
    width: 100, // Adjust to your preferred size
    height: 35,
  },
  toggleButton: {
    border: 'none',
    height: 28,

    '&.Mui-selected': {
      backgroundColor: '#ECB740 !important', // Orange color for selected language
      color: '#fff',
      borderRadius: '20px',
    },
    '&:not(.Mui-selected)': {
      color: '#ECB740',
      borderRadius:'20px',
      padding:'15px',
      
    },
  },
});

const LanguageToggle = () => {
  const router = useRouter();
  const classes = useStyles();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';

  const changeLanguage = (e: any) => {
    const value = e.target.value;
    
    if (value) {
      if (value !== langCurrent) {
        const newPathname = `/${value}${pathname.replace(/^\/(en|ar)/, '')}`;
        Cookies.set('NEXT_LOCALE', value);
        router.push(newPathname);
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={langCurrent}
      exclusive
      onChange={changeLanguage}
      className={classes.toggleGroup}
    >
      <ToggleButton
        value="ar"
        className={classes.toggleButton}
      >
        AR
      </ToggleButton>
      <ToggleButton
        value="en"
        className={classes.toggleButton}
      >
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggle;

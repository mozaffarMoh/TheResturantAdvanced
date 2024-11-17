'use client';
import { Bill, EnterName, Header, MenuList } from '@/components';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { isAbsolute } from 'path';

const HomePage: NextPage = () => {
  const [isCsr, setIsCsr] = useState(false);
  const [billData, setBillData] = useState([]);
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [cashierName, setCashierName] = useState('');
  const [chosenCount, setChosenCount] = useState<number>(1);
  let cashNameCookies = Cookies.get('cashierName');

  useEffect(() => {
    setIsCsr(true);
  }, []);

  useEffect(() => {
    if (isCsr) {
      if (cashNameCookies) {
        setIsNameEntered(true);
        setCashierName(cashNameCookies);
      }
    }
  }, [isCsr]);

  return isCsr ? (
    <Container maxWidth="xl">
      <Header />
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        direction={'row'}
        flexWrap={'wrap'}
        minHeight={'70vh'}
        paddingY={2}
      >
        {!isNameEntered && !cashNameCookies ? (
          <EnterName
            setIsNameEntered={setIsNameEntered}
            cashierName={cashierName}
            setCashierName={setCashierName}
          />
        ) : (
          <>
            <MenuList
              setBillData={setBillData}
              chosenCount={chosenCount}
              setChosenCount={setChosenCount}
            />
            <Bill
              setBillData={setBillData}
              billData={billData}
              cashierName={cashierName}
              chosenCount={chosenCount}
            />
          </>
        )}
      </Stack>
    </Container>
  ) : (
    <></>
  );
};

export default HomePage;

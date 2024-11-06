'use client';
import { Bill, Header, MenuList } from '@/components';
import { Container, Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const HomePage: NextPage = () => {
  const [isCsr, setIsCsr] = useState(false);
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    setIsCsr(true);
  }, []);
  return isCsr ? (
    <Container maxWidth="xl">
      <Header />
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        direction={'row'}
        flexWrap={'wrap'}
        paddingY={2}
      >
        <MenuList
          setBillData={setBillData}
          billData={billData}
        />
        <Bill
          setBillData={setBillData}
          billData={billData}
        />
      </Stack>
    </Container>
  ) : (
    <></>
  );
};

export default HomePage;

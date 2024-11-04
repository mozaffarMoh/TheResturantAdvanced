'use client';
import { Bill, Header, MenuList } from '@/components';
import { Container, Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const HomePage: NextPage = () => {
  const [isCsr, setIsCsr] = useState(false);

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
      >
        <MenuList />
        <Bill />
      </Stack>
    </Container>
  ) : (
    <></>
  );
};

export default HomePage;

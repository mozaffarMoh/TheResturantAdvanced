'use client';
import { Header } from '@/components';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCsr, setIsCsr] = useState(false);

  useEffect(() => {
    setIsCsr(true);
  }, []);
  return isCsr ? (
    <Stack>
      <Header />
      {children}
    </Stack>
  ) : (
    <></>
  );
}

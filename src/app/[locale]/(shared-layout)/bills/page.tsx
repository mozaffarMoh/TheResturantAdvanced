'use client';
import {
  fourthColor,
  primaryColor,
  secondaryColor,
  thirdColor,
} from '@/constant/color';
import {
  Button,
  Container,
  Pagination,
  PaginationItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import useGet from '@/custom-hooks/useGet';
import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import usePost from '@/custom-hooks/usePost';
import NoData from '@/components/NoData/NoData';
import { BillModal } from '@/components';

const MyActivity = () => {
  const t = useTranslations();
  const pathname = usePathname();
  let isArabic = pathname.startsWith('/ar');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isClientSide, setIsClientSide] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const labels = [
    t('my-bills.id'),
    t('my-bills.total'),
    t('my-bills.date'),
    t('my-bills.time'),
    t('my-bills.details'),
  ];

  const dataSource = [
    {
      id: '1',
      total: '100.00',
      date: '2024-11-01',
      time: '10:30 AM',
      details: 'View details',
    },
    {
      id: '2',
      total: '200.00',
      date: '2024-11-02',
      time: '11:00 AM',
      details: 'View details',
    },
    // Add more data as needed
  ];

  const [data, loading, getData, success, , , , fullData] = usePost('', {});

  const handleChange = (e: any, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    getData();
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (success) {
      let totalNum = fullData?.meta?.total || 0;
      const paginationCount = Math.ceil(totalNum / 15);
      setTotal(paginationCount);
    }
  }, [success]);

  useEffect(() => {
    total > 0 && getData();
  }, [page]);

  return (
    <Container maxWidth="lg">
      <BillModal
        open={showBillDetails}
        handleCancel={() => setShowBillDetails(false)}
      />{' '}
      {isClientSide && (
        <head>
          <title>{t('header.bills')}</title>
          <meta
            name="description"
            content="Welcome to the My-Activity page of The Platform Website"
          />
        </head>
      )}{' '}
      <Stack
        paddingY={5}
        gap={7}
      >
        <Stack textAlign={'center'}>
          <Typography
            color={secondaryColor}
            variant="h4"
            fontWeight={600}
          >
            {t('header.bills')}
          </Typography>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {labels.map((label: string, i: number) => (
                  <TableCell
                    key={i}
                    align="center"
                    sx={{ backgroundColor: secondaryColor, color: 'white' }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && !success
                ? // Render Skeletons when loading
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from(new Array(5)).map((_, index) => (
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : dataSource &&
                  dataSource.map((bill: any) => {
                    return (
                      <TableRow key={bill?.id}>
                        <TableCell align="center">{bill?.id}</TableCell>
                        <TableCell align="center">{bill?.total}$</TableCell>
                        <TableCell align="center">{bill?.date}</TableCell>
                        <TableCell align="center">{bill?.time}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="warning"
                            sx={{ bgcolor: primaryColor, color: 'white' }}
                            onClick={() => setShowBillDetails(true)}
                          >
                            {t('buttons.show-details')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        {success && data && data.length == 0 && <NoData />}
        {data && data.length > 0 && (
          <Stack
            alignItems={'center'}
            paddingBottom={10}
          >
            <Pagination
              page={page}
              count={total}
              onChange={handleChange}
              siblingCount={2} // Number of siblings to show around the current page
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    color: '#3F485E',
                    '&.Mui-selected': {
                      backgroundColor: '#3F485E',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#3F485EDD' },
                    },
                  }}
                  slots={{
                    previous: isArabic
                      ? ArrowForwardIosRounded
                      : ArrowBackIosNewRounded,
                    next: isArabic
                      ? ArrowBackIosNewRounded
                      : ArrowForwardIosRounded,
                  }}
                />
              )}
            />
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default MyActivity;

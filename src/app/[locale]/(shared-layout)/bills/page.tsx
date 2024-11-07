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
import { BillModal, ConfirmationModal, CustomAlert } from '@/components';
import useDelete from '@/custom-hooks/useDelete';

const MyActivity = () => {
  const t = useTranslations();
  const pathname = usePathname();
  let isArabic = pathname.startsWith('/ar');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isClientSide, setIsClientSide] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [billDetails, setBillDetails] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  const labels = [
    t('my-bills.id'),
    t('my-bills.total'),
    t('my-bills.date'),
    t('my-bills.time'),
    t('my-bills.details'),
  ];

  const [bills, loadingBills, getBills, successBills] = useGet('/en/api/bills');

  const [
    ,
    loadingDeleteType,
    handleDeleteTypeProcess,
    successDeleteType,
    successDeleteTypeMessage,
    errorDeleteTypeMessage,
  ] = useDelete('/en/api/bills', { itemId: currentId });

  useEffect(() => {
    getBills();
    setIsClientSide(true);
  }, []);

  const handleChange = (e: any, value: number) => {
    setPage(value);
  };

  const handleDeleteItem = (id: any) => {
    setShowDeleteConfirmation(true);
    setCurrentId(id);
  };

  useEffect(() => {
    if (successDeleteType) {
      setShowDeleteConfirmation(false);
      setCurrentId(0);
      getBills();
    }
  }, [successDeleteType]);

  return (
    <Container maxWidth="lg">
      <CustomAlert
        openAlert={Boolean(errorDeleteTypeMessage)}
        setOpenAlert={() => {}}
        message={errorDeleteTypeMessage}
      />
      <CustomAlert
        openAlert={Boolean(successDeleteTypeMessage)}
        type="success"
        setOpenAlert={() => {}}
        message={successDeleteTypeMessage}
      />
      <ConfirmationModal
        open={showDeleteConfirmation}
        handleCancel={() => setShowDeleteConfirmation(false)}
        handleConfirm={handleDeleteTypeProcess}
        loading={loadingDeleteType}
        message={t('messages.delete-item')}
      />
      <BillModal
        open={showBillDetails}
        handleCancel={() => setShowBillDetails(false)}
        data={billDetails || {}}
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
              {loadingBills && bills.length == 0
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
                : bills &&
                  bills.reverse().map((bill: any, i: number) => {
                    return (
                      <TableRow
                        key={bill?._id}
                        onClick={() => setBillDetails(bill)}
                      >
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">
                          {bill?.details?.total}$
                        </TableCell>
                        <TableCell align="center">
                          {bill?.details?.date}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ direction: 'ltr' }}
                        >
                          {bill?.details?.time}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="warning"
                            sx={{ bgcolor: primaryColor, color: 'white' }}
                            onClick={() => setShowBillDetails(true)}
                          >
                            {t('buttons.show-details')}
                          </Button>{' '}
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ bgcolor: secondaryColor, color: 'white' }}
                            onClick={() => handleDeleteItem(bill?._id)}
                          >
                            {t('buttons.delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
          {successBills && bills?.length == 0 && <NoData />}
        </TableContainer>

        {/*      {success && data && data.length == 0 && <NoData />}
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
        )} */}
      </Stack>
    </Container>
  );
};

export default MyActivity;

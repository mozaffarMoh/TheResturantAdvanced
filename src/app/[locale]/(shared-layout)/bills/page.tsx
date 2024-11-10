'use client';
import { fourthColor, primaryColor, secondaryColor } from '@/constant/color';
import {
  Button,
  Checkbox,
  Container,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import useGet from '@/custom-hooks/useGet';
import NoData from '@/components/NoData/NoData';
import { BillModal, ConfirmationModal, CustomAlert } from '@/components';
import useDelete from '@/custom-hooks/useDelete';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import CustomSkeleton from '@/components/skeleton/CustomSkeleton';
import { usePathname } from 'next/navigation';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const MyBills = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const isArabic = pathname.startsWith('/ar');
  const [isClientSide, setIsClientSide] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [billDetails, setBillDetails] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentDate, setCurrentDate]: any = useState<dayjs.Dayjs | null>(null);
  const [currentDateString, setCurrentDateString]: any = useState('');
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [totalDayPrice, setTotalDayPrice] = useState(0);

  const labels = [
    t('my-bills.select'),
    t('my-bills.number'),
    t('my-bills.total'),
    t('my-bills.date'),
    t('my-bills.time'),
    t('my-bills.details'),
  ];

  const [bills, loadingBills, getBills, successBills] = useGet(
    `/en/api/bills?param=${currentDateString}`,
  );

  const [
    ,
    loadingDeleteBill,
    handleDeleteBillProcess,
    successDeleteBill,
    successDeleteBillMessage,
    errorDeleteBillMessage,
  ] = useDelete('/en/api/bills', { billsIDs: selectedBills });

  useEffect(() => {
    !isClientSide && setIsClientSide(true);
    if (!currentDate && !currentDateString) {
      const today = dayjs();
      setCurrentDate(today);
      setCurrentDateString(today.format('YYYY-MM-DD'));
    } else {
      setTotalDayPrice(0);
      getBills();
    }
  }, [currentDate, currentDateString]);

  const handleSelectBill = (id: string) => {
    setSelectedBills((prev) =>
      prev.includes(id)
        ? prev.filter((billId) => billId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteItem = () => {
    if (selectedBills?.length > 0) {
      setShowDeleteConfirmation(true);
    }
  };

  useEffect(() => {
    if (successDeleteBill) {
      setShowDeleteConfirmation(false);
      getBills();
      setSelectedBills([]);
    }
  }, [successDeleteBill]);

  const handleSetDate = (date: any, dateString: string | string[]) => {
    setCurrentDate(date);
    setCurrentDateString(
      Array.isArray(dateString) ? dateString[0] : dateString,
    );
  };

  useEffect(() => {
    if (successBills) {
      let totalPrice = 0;
      bills.forEach((item: any) => {
        totalPrice += Number(item?.details?.total);
      });
      setTotalDayPrice(totalPrice);
    }
  }, [successBills]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const paginatedBills =
    bills?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  return (
    <Container maxWidth="lg">
      {isClientSide && (
        <head>
          <title>{t('header.bills')}</title>
          <meta
            name="description"
            content="Welcome to the My-Activity page of The Platform Website"
          />
        </head>
      )}{' '}
      <CustomAlert
        openAlert={Boolean(errorDeleteBillMessage)}
        setOpenAlert={() => {}}
        message={errorDeleteBillMessage}
      />
      <CustomAlert
        openAlert={Boolean(successDeleteBillMessage)}
        type="success"
        setOpenAlert={() => {}}
        message={successDeleteBillMessage}
      />
      <ConfirmationModal
        open={showDeleteConfirmation}
        handleCancel={() => setShowDeleteConfirmation(false)}
        handleConfirm={handleDeleteBillProcess}
        loading={loadingDeleteBill}
        message={t('messages.delete-bills')}
      />
      <BillModal
        open={showBillDetails}
        handleCancel={() => setShowBillDetails(false)}
        data={billDetails || {}}
      />{' '}
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

        <Stack
          width={200}
          gap={1}
        >
          <Typography
            color={fourthColor}
            variant="body2"
            fontWeight={400}
          >
            {t('my-bills.search-by-date')}
          </Typography>
          <DatePicker
            value={currentDate}
            onChange={handleSetDate}
          />{' '}
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
              {loadingBills
                ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from(new Array(6)).map((_, index) => (
                        <TableCell key={index}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : paginatedBills.map((bill: any, i: number) => (
                    <TableRow
                      key={bill?._id}
                      onClick={() => setBillDetails(bill)}
                    >
                      <TableCell
                        align="center"
                        width={200}
                      >
                        <Checkbox
                          checked={selectedBills.includes(bill._id)}
                          onChange={() => handleSelectBill(bill._id)}
                          color="warning"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {bill?.details?.billCount || 0}
                      </TableCell>
                      <TableCell align="center">
                        {bill?.details?.total} $
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
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {bills?.length > 0 && (
            <Stack
              direction={'row'}
              paddingY={3}
              paddingX={isArabic ? 5 : 10}
              justifyContent={'flex-end'}
            >
              {t('my-bills.total-day-price')}:{' '}
              {loadingBills ? (
                <Skeleton
                  width={50}
                  sx={{ mx: 1 }}
                />
              ) : (
                totalDayPrice
              )}{' '}
              $
            </Stack>
          )}
          {successBills && bills?.length === 0 && <NoData />}

          <TablePagination
            rowsPerPageOptions={[5, 10, 15,20,25]}
            component="div"
            count={bills?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Button
          variant="contained"
          color="error"
          sx={{ bgcolor: secondaryColor, color: 'white', width: 200 }}
          onClick={handleDeleteItem}
        >
          {t('buttons.delete-selected')}
        </Button>
      </Stack>
    </Container>
  );
};

export default MyBills;

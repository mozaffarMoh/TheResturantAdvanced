'use client';
import './Bill.scss';
import { TiDocumentDelete } from 'react-icons/ti';
import { MdDelete } from 'react-icons/md';
import { FcPrint } from 'react-icons/fc';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { CircularProgress, Stack, Typography } from '@mui/material';
import usePost from '@/custom-hooks/usePost';
import useGet from '@/custom-hooks/useGet';
import CustomSkeleton from '../skeleton/CustomSkeleton';
import CustomAlert from '../CustomAlert/CustomAlert';
import PasswordModal from '../PasswordModal/PasswordModal';
import Cookies from 'js-cookie';

const Bill = ({ setBillData, billData, cashierName, chosenCount }: any) => {
  const t = useTranslations();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  const [deleteHover, setDeleteHover] = React.useState(false);
  const [minusOneHover, setMinusOneHover] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showRemoveCashConfirmation, setShowRemoveCashConfirmation] =
    React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [billPayload, setBillPayload]: any = React.useState(null);
  const [totalCash, setTotalCash] = React.useState(0);
  const [billCount, setBillCount] = React.useState(0);

  const [
    ,
    loadingAddBill,
    handleAddBill,
    successAddBill,
    successAddBillMessage,
    errorAddBillMessage,
  ] = usePost('/en/api/bills', billPayload);

  const [
    totalCashDetails,
    loadingGetTotalCash,
    handleGetTotalCash,
    successGetTotalCash,
  ] = useGet('/en/api/totalCash');

  const [
    ,
    loadingClearTotalCash,
    handleClearTotalCash,
    successClearTotalCash,
    successClearTotalCashMessage,
    errorClearTotalCashMessage,
  ] = usePost('/en/api/totalCash', 0);

  const columns: any = [
    {
      title: t('table.count'),
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: t('table.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: any) => <p>{name?.[langCurrent]}</p>,
    },
    {
      title: t('table.unit-price'),
      dataIndex: 'price',
      key: 'price',
      render: (unit: number) => <p>{unit + ' '}$</p>,
    },
    {
      title: t('table.total-price'),
      dataIndex: 'price',
      key: 'price',
      render: (unit: number, item: any) => <p>{unit * item?.count + ' '}$</p>,
    },
    {
      title: t('table.actions'),
      render: (_: any, item: any, index: number) => {
        return (
          <div className="flexStart">
            <div
              className={`action-area flexCenter ${
                minusOneHover && index === hoverIndex && 'action-area-hover'
              }`}
              onClick={() => handleMinusCount(index)}
            >
              <TiDocumentDelete
                className="minus-one"
                color="green"
                onMouseEnter={() => {
                  setMinusOneHover(true);
                  setHoverIndex(index);
                }}
                onMouseLeave={() => setMinusOneHover(false)}
              />
            </div>
            <div
              className={`action-area flexCenter ${
                deleteHover && index === hoverIndex && 'action-area-hover'
              }`}
              onClick={() => handleRemoveItem(index)}
            >
              <MdDelete
                className="remove-item"
                color="red"
                onMouseEnter={() => {
                  setDeleteHover(true);
                  setHoverIndex(index);
                }}
                onMouseLeave={() => setDeleteHover(false)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    handleGetTotalCash();
  }, []);

  useEffect(() => {
    if (successGetTotalCash) {
      setTotalCash(totalCashDetails?.totalCash);
      setBillCount(totalCashDetails?.billCount);
    }
  }, [totalCashDetails]);

  /* Calculate Total Price */
  React.useEffect(() => {
    setTotalPrice(0);
    for (let i = 0; i < billData.length; i++) {
      const itemTotal = billData?.[i]?.price * billData?.[i]?.count;
      setTotalPrice((prev) => prev + itemTotal);
    }
  }, [billData]);

  /* Remove Item */
  const handleRemoveItem = (index: number) => {
    setBillData((prevArr: any) => {
      const newArr = [...prevArr].filter((_, i) => i !== index);
      return newArr;
    });
  };

  const handleMinusCount = (index: number) => {
    setBillData((prevArr: any) => {
      let newArr = [...prevArr].map((item, i) => {
        if (i === index) {
          return { ...item, count: item?.count - chosenCount };
        } else {
          return item;
        }
      });
      const filterdArray = newArr.filter((item) => item?.count > 0);
      return filterdArray;
    });
  };

  const addBillToPayload = () => {
    /* remove images from payload */
    let dataWithoutImages = billData.map((item: any) => {
      delete item?.image;
      return item;
    });
    let bills = {
      items: dataWithoutImages,
      details: {
        date: format(new Date(), 'yyyy-MM-dd'), // Format date as YYYY-MM-DD
        time: format(new Date(), 'hh:mm:ss a'), // Format time as HH:MM:SS
        billCount: billCount,
        cashierName: cashierName,
        total: totalPrice,
      },
    };

    setBillPayload(bills);
  };

  const handlePrint = () => {
    if (billData?.length > 0 && billCount > 0) {
      addBillToPayload();
    }
  };

  /* add bill to database and print */
  useEffect(() => {
    if (billPayload) {
      handleAddBill();
      window.print();
    }
  }, [billPayload]);

  useEffect(() => {
    if (successAddBill) {
      setBillPayload(null);
      setTotalPrice(0);
      setBillCount(0);
      setBillData([]);
      handleGetTotalCash();
      setShowRemoveCashConfirmation(false);
    }
    if (successClearTotalCash) {
      Cookies.remove('cashierName');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [successAddBill, successClearTotalCash]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className="bill">
      <CustomAlert
        openAlert={
          Boolean(errorClearTotalCashMessage) ||
          Boolean(errorAddBillMessage) ||
          Boolean(errorMessage)
        }
        setOpenAlert={() => setErrorMessage('')}
        message={
          errorClearTotalCashMessage || errorAddBillMessage || errorMessage
        }
      />
      <CustomAlert
        openAlert={
          Boolean(successClearTotalCashMessage) ||
          Boolean(successAddBillMessage)
        }
        type="success"
        setOpenAlert={() => {}}
        message={successClearTotalCashMessage || successAddBillMessage}
      />
      <PasswordModal
        open={showRemoveCashConfirmation}
        loading={loadingClearTotalCash}
        handleCancel={() => setShowRemoveCashConfirmation(false)}
        handleConfirm={handleClearTotalCash}
        setErrorMessage={setErrorMessage}
      />

      {/* This part is hidden this is only for print paper bill */}
      <Stack
        className="print-content-date"
        gap={2}
      >
        <Typography
          textAlign={'center'}
          className="title"
        >
          {' '}
          {t('print-paper-data.theResturant')}
        </Typography>
        <p>
          {t('print-paper-data.bill-number')} {billCount}
        </p>
        <p>
          {t('print-paper-data.cashierName')} {cashierName}
        </p>

        <p>{t('print-paper-data.address')}</p>
        <p>{t('print-paper-data.phone')} </p>
        <p>
          {format(new Date(), 'yyyy-MM-dd')} -{' '}
          {format(new Date(), 'hh:mm:ss a')}
        </p>
      </Stack>

      {/* Table Bill */}
      <Table
        className="table-container"
        dataSource={billData}
        columns={columns}
        key={'key'}
        footer={() => (
          <p className="total-price-footer">
            {t('table.total-price')}: &nbsp;{' '}
            <span className="total-price">{totalPrice + ' '}$</span>
          </p>
        )}
        scroll={{ x: 420 }}
        pagination={false}
      />

      <div style={{ position: 'relative' }}>
        <button
          className={`print-button flexCenterColumn ${!(billData?.length > 0 && billCount > 0) ? 'print-disabled' : ''} `}
          onClick={handlePrint}
        >
          {loadingAddBill ? (
            <CircularProgress
              color="error"
              size={40}
              sx={{ m: 1.5 }}
            />
          ) : (
            <>
              <p>{t('bill.print')}</p>
              <FcPrint className="print-logo" />
            </>
          )}
        </button>
        <button
          className="add-to-cash"
          onClick={() => setShowRemoveCashConfirmation(true)}
        >
          <p>{t('bill.clear-cash')}</p>
        </button>

        <div className="total-cash flexCenterColumn">
          <Stack
            direction={'row'}
            gap={1}
          >
            {t('bill.total-cash')} :{' '}
            {loadingGetTotalCash ? (
              <CustomSkeleton width={40} />
            ) : (
              totalCash || 0
            )}{' '}
            $
          </Stack>
        </div>

        <button className="total-cash flexCenterColumn">
          <p>
            {t('print-paper-data.cashierName')} {cashierName}
          </p>
        </button>
      </div>
    </div>
  );
};

export default Bill;

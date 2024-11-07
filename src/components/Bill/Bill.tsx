'use client';
import './Bill.scss';
import { TiDocumentDelete } from 'react-icons/ti';
import { MdDelete } from 'react-icons/md';
import { FcPrint } from 'react-icons/fc';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { CircularProgress, Stack } from '@mui/material';
import usePost from '@/custom-hooks/usePost';
import useGet from '@/custom-hooks/useGet';
import CustomSkeleton from '../skeleton/CustomSkeleton';
import CustomAlert from '../CustomAlert/CustomAlert';

const Bill = ({ setBillData, billData }: any) => {
  const t = useTranslations();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  const [deleteHover, setDeleteHover] = React.useState(false);
  const [minusOneHover, setMinusOneHover] = React.useState(false);
  const [showRemoveCashConfirmation, setShowRemoveCashConfirmation] =
    React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [billPayload, setBillPayload]: any = React.useState(null);

  const [
    ,
    loadingAddBill,
    handleAddBill,
    successAddBill,
    successAddBillMessage,
    errorAddBillMessage,
  ] = usePost('/en/api/bills', billPayload);

  const [totalCash, loadingGetTotalCash, handleGetTotalCash] =
    useGet('/en/api/totalCash');

  const [
    ,
    loadingClearTotalCash,
    handleClearTotalCash,
    successClearTotalCash,
    successClearTotalCashMessage,
    errorClearTotalCashMessage,
  ] = usePost('/en/api/totalCash', 0);

  useEffect(() => {
    handleGetTotalCash();
  }, []);

  useEffect(() => {
    if (billPayload && billData?.length > 0) {
      handleAddBill();
    }
  }, [billPayload]);

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
      render: (unit: number) => <p>{unit}$</p>,
    },
    {
      title: t('table.total-price'),
      dataIndex: 'price',
      key: 'price',
      render: (unit: number, item: any) => <p>{unit * item?.count}$</p>,
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
              onClick={() => handleMinusOne(index)}
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

  const handleMinusOne = (index: number) => {
    setBillData((prevArr: any) => {
      let newArr = [...prevArr].map((item, i) => {
        if (i === index) {
          return { ...item, count: item?.count - 1 };
        } else {
          return item;
        }
      });
      const filterdArray = newArr.filter((item) => item?.count > 0);
      return filterdArray;
    });
  };

  const addBill = () => {
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
        total: totalPrice,
      },
    };
    setBillPayload(bills);
  };

  useEffect(() => {
    if (successAddBill || successClearTotalCash) {
      setBillPayload(null);
      setBillData([]);
      handleGetTotalCash();
      setShowRemoveCashConfirmation(false);
    }
  }, [successAddBill, successClearTotalCash]);

  return (
    <div className="bill">
      <CustomAlert
        openAlert={
          Boolean(errorClearTotalCashMessage) || Boolean(errorAddBillMessage)
        }
        setOpenAlert={() => {}}
        message={errorClearTotalCashMessage || errorAddBillMessage}
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
      <ConfirmationModal
        open={showRemoveCashConfirmation}
        loading={loadingClearTotalCash}
        handleCancel={() => setShowRemoveCashConfirmation(false)}
        handleConfirm={handleClearTotalCash}
        message={t('messages.clear-cash')}
      />
      <Table
        className="table-container"
        dataSource={billData}
        columns={columns}
        key={'key'}
        footer={() => (
          <p>
            {t('table.total-price')}: &nbsp;{' '}
            <span className="total-price">{totalPrice + ' '}$</span>
          </p>
        )}
        scroll={{ x: 420 }}
        pagination={
          billData?.length > 10
            ? {
                pageSize: 10, // Or whatever your page size is
                style: {
                  direction: 'ltr', // Ensure LTR pagination direction
                },
              }
            : false
        }
      />

      <div style={{ position: 'relative' }}>
        <button
          className="print-button flexCenterColumn"
          onClick={() => window.print()}
        >
          <p>{t('bill.print')}</p>
          <FcPrint className="print-logo" />
        </button>
        <button
          className="add-to-cash"
          onClick={addBill}
        >
          {loadingAddBill ? (
            <CircularProgress
              color="error"
              size={20}
              sx={{ mt: 0.8 }}
            />
          ) : (
            <p>{t('bill.add-to-cash')}</p>
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
      </div>
    </div>
  );
};

export default Bill;

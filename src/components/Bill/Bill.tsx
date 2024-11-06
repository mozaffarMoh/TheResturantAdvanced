'use client';
import './Bill.scss';
import { TiDocumentDelete } from 'react-icons/ti';
import { MdDelete } from 'react-icons/md';
import { FcPrint } from 'react-icons/fc';
import { Table } from 'antd';
import React from 'react';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { usePathname } from 'next/navigation';

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
  const totalCashCookies: any = Cookies.get('totalCash');
  const [totalCash, setTotalCash]: any = React.useState(totalCashCookies | 0);

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

  /* Remove cash */
  const removeCash = () => {
    Cookies.remove('totalCash');
    setTotalCash(0);
    setShowRemoveCashConfirmation(false);
  };

  /* Add bill to cash and remove current array */
  const addToCash = () => {
    setTotalCash((prev: any) => prev + totalPrice);
  };

  /* Set cash in cookies */
  React.useEffect(() => {
    Cookies.set('totalCash', totalCash);
  }, [totalCash]);

  return (
    <div className="bill">
      <Table
        className="table-container"
        dataSource={billData}
        columns={columns}
        key={'key'}
        footer={() => (
          <p>
            {t('table.total-price')}: &nbsp;{' '}
            <span className="total-price">{totalPrice}</span> $
          </p>
        )}
        scroll={{ x: 420 }}
        pagination={{
          defaultPageSize: 10, // Or whatever your page size is
      
          style: {
            direction: 'ltr', // Ensure LTR pagination direction
          },
        }}
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
          onClick={addToCash}
        >
          <p>{t('bill.add-to-cash')}</p>
        </button>
        <button
          className="add-to-cash"
          onClick={() => setShowRemoveCashConfirmation(true)}
        >
          <p>{t('bill.clear-cash')}</p>
        </button>

        <div className="total-cash flexCenterColumn">
          <p>
            {t('bill.total-cash')} :{' '}
            {totalCashCookies ? totalCashCookies : totalCash} $
          </p>
        </div>

        <ConfirmationModal
          open={showRemoveCashConfirmation}
          handleCancel={() => setShowRemoveCashConfirmation(false)}
          handleConfirm={removeCash}
          message={t('messages.clear-cash')}
        />
      </div>
    </div>
  );
};

export default Bill;

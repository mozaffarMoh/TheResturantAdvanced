'use client';
import { primaryColor, secondaryColor } from '@/constant/color';
import { ArrowBack } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Table } from 'antd';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const BillModal = ({ open, handleCancel, data = {} }: any) => {
  const t = useTranslations();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';

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
  ];

  return (
    <Dialog
      className="logout-alert"
      open={open}
      onClose={handleCancel}
    >
      <Table
        className="table-container"
        dataSource={data?.items}
        columns={columns}
        key={'key'}
        scroll={{ x: 420 }}
        footer={() => (
          <p>
            {t('table.total-price')}: &nbsp;{' '}
            <span className="total-price">{data?.details?.total + ' '}$</span>
          </p>
        )}
        pagination={
          data?.items?.length > 10
            ? {
                pageSize: 10, // Or whatever your page size is
                style: {
                  direction: 'ltr', // Ensure LTR pagination direction
                },
              }
            : false
        }
      />
      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{
            background: secondaryColor,
            '&:hover': { background: secondaryColor },
            gap: 0.5,
            direction: 'ltr',
          }}
        >
          <ArrowBack />
          {t('buttons.back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillModal;

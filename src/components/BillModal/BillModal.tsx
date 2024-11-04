'use client';
import { primaryColor, secondaryColor } from '@/constant/color';
import { ArrowBack } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Table } from 'antd';
import { useTranslations } from 'next-intl';

const BillModal = ({ open, handleCancel }: any) => {
  const t = useTranslations();

  const columns: any = [
    {
      title: t('table.num'),
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: t('table.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('table.unit-price'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: t('table.total-price'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (unit: number, item: any) => <p>{unit * item?.num}</p>,
    },
  ];

  let ordersArray: any = [];

  return (
    <Dialog
      className="logout-alert"
      open={open}
      onClose={handleCancel}
    >
      <Table
        className="table-container"
        dataSource={ordersArray}
        columns={columns}
        key={'key'}
        scroll={{ x: 420 }}
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

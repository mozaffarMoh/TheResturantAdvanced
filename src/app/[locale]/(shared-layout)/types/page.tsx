'use client';
import useGet from '@/custom-hooks/useGet';
import {
  CircularProgress,
  Container,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Typography, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Delete, Edit } from '@mui/icons-material';
import {
  fourthColor,
  primaryColor,
  secondaryColor,
  thirdColor,
} from '@/constant/color';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { ConfirmationModal, CustomAlert } from '@/components';
import { Input } from 'antd';
import Base64 from '@/constant/Base64';
import { LoadingButton } from '@mui/lab';
import usePost from '@/custom-hooks/usePost';
import useDelete from '@/custom-hooks/useDelete';
import usePut from '@/custom-hooks/usePut';

const MenuEdit = () => {
  const t = useTranslations();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [showEditMode, setShowEditMode] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [errorMessageFile, setErrorMessageFile] = useState<string>('');
  const [currentType, setCurrentType] = useState('');
  const [newType, setNewType] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [uploadedFile, setUploadedFile] = useState('');

  const bodyAdd = {
    type: currentType,
    data: {
      _id: currentId,
      name,
      price,
      image: uploadedFile,
    },
  };

  const [, loadingAddItem, handleAddItem, successAddItem] = usePost(
    '/en/api/menu',
    bodyAdd,
  );

  const [, loadingAddNewType, handleAddNewType, successAddNewType] = usePost(
    '/en/api/menu-type',
    { type: newType },
  );

  const [, loadingEditItem, handleEditItemProcess, successEditItem] = usePut(
    '/en/api/menu',
    bodyAdd,
  );
  const [, loadingDeleteItem, handleDeleteItemProcess, successDeleteItem] =
    useDelete('/en/api/menu', { itemId: currentId, type: currentType });

  const [menuItems, loading, getMenu, success] = useGet('/en/api/menu');

  useEffect(() => {
    getMenu();
  }, []);

  const labels = [t('table.id'), t('table.type'), t('table.actions')];

  const primaryObj = {
    color: primaryColor,
    cursor: 'pointer',
    ':hover': { color: primaryColor + 'cc' },
  };

  const secondaryObj = {
    color: secondaryColor,
    cursor: 'pointer',
    mx: 1,
    ':hover': { color: secondaryColor + 'cc' },
  };

  const handleDeleteItem = (id: any) => {
    setShowDeleteConfirmation(true);
    setCurrentId(id);
  };

  const handleEditItem = (item: any) => {
    handleCancel();
    setShowEditMode(true);
    setName(item?.name);
    setPrice(item?.price);
    setCurrentId(item?._id);
  };

  const handleCancel = () => {
    setShowAddItem(false);
    setShowEditMode(false);
    setShowDeleteConfirmation(false);
    setName('');
    setPrice(0);
    setCurrentType('');
    setUploadedFile('');
    setCurrentId(0);
  };

  useEffect(() => {
    if (
      successDeleteItem ||
      successAddItem ||
      successEditItem ||
      successAddNewType
    ) {
      handleCancel();
      getMenu();
    }
  }, [successAddItem, successDeleteItem, successEditItem, successAddNewType]);

  return (
    <Container>
      <ConfirmationModal
        open={showDeleteConfirmation}
        handleCancel={() => setShowDeleteConfirmation(false)}
        handleConfirm={handleDeleteItemProcess}
        loading={loadingDeleteItem}
        message={t('messages.delete-item')}
      />
      <CustomAlert
        openAlert={Boolean(errorMessageFile)}
        setOpenAlert={() => setErrorMessageFile('')}
        message={errorMessageFile}
      />

      <Stack
        alignItems={'center'}
        py={3}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          color={secondaryColor}
          mb={10}
          mt={5}
        >
          {t('header.types')}
        </Typography>

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
              {loading && menuItems.length == 0
                ? // Render Skeletons when loading
                  Array.from(new Array(4)).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from(new Array(3)).map((_, index) => (
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : [{ type: 'Sandwich' }, { type: 'Meals' }].map(
                    (bill: any, i: number) => {
                      return (
                        <TableRow key={bill?.id}>
                          <TableCell align="center">{i + 1}</TableCell>
                          <TableCell align="center">{bill?.type}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ bgcolor: secondaryColor, color: 'white' }}
                            >
                              {t('buttons.delete')}
                            </Button>
                            <Button
                              variant="contained"
                              color="warning"
                              sx={{
                                bgcolor: primaryColor,
                                color: 'white',
                                mx: 1,
                              }}
                            >
                              {t('buttons.edit')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    },
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Add Type */}
      <Stack
        width={250}
        py={2}
        gap={1}
      >
        <Typography
          variant="h5"
          color={secondaryColor}
          fontWeight={600}
        >
          {t('labels.add-type')}
        </Typography>
        <Input />
        <Button
          variant="contained"
          color="error"
          fullWidth
        >
          {t('buttons.add')}
        </Button>
      </Stack>
    </Container>
  );
};

export default MenuEdit;

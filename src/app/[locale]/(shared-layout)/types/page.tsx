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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentType, setCurrentType] = useState('');
  const [newType, setNewType] = useState('');

  const [, loadingAddNewType, handleAddNewType, successAddNewType] = usePost(
    '/en/api/types',
    { newType: newType },
  );

  const [, loadingEditItem, handleEditItemProcess, successEditItem] = usePut(
    '/en/api/types',
    { itemId: currentId, updatedType: currentType },
  );
  const [, loadingDeleteItem, handleDeleteItemProcess, successDeleteItem] =
    useDelete('/en/api/types', { itemId: currentId });

  const [menuItems, loading, getMenu, success] = useGet('/en/api/types');

  useEffect(() => {
    getMenu();
  }, []);

  const labels = [t('table.id'), t('table.type'), t('table.actions')];

  const handleDeleteItem = (id: any) => {
    setShowDeleteConfirmation(true);
    setCurrentId(id);
  };

  const handleEditItem = (item: any) => {
    handleCancel();
    setShowEditMode(true);
    setCurrentType(item?.type);
    setCurrentId(item?.id);
  };

  const handleCancel = () => {
    setShowEditMode(false);
    setShowDeleteConfirmation(false);
    setCurrentType('');
    setNewType('');
    setCurrentId(0);
  };

  useEffect(() => {
    if (successDeleteItem || successEditItem || successAddNewType) {
      handleCancel();
      getMenu();
    }
  }, [successDeleteItem, successEditItem, successAddNewType]);

  /* Add or edit */
  const handleProcess = (process: string) => {
    if (process == 'edit') {
      !currentId
        ? setErrorMessage('field should not empty')
        : handleEditItemProcess;
    }
    if (process == 'add') {
      !newType ? setErrorMessage('field should not empty') : handleAddNewType;
    }
  };

  /* empty the error message */
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }, [errorMessage]);

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
        openAlert={Boolean(errorMessage)}
        setOpenAlert={() => setErrorMessage('')}
        message={errorMessage}
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
                : menuItems &&
                  menuItems.map((item: any, i: number) => {
                    let isEdit = showEditMode && item?.id == currentId;
                    console.log(currentId, '$$$', item?.id);

                    return (
                      <TableRow key={item?.id}>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">
                          {isEdit ? (
                            <Input
                              value={currentType}
                              onChange={(e: any) => {
                                setCurrentType(e.target.value);
                              }}
                            />
                          ) : (
                            item?.type
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ bgcolor: secondaryColor, color: 'white' }}
                            onClick={
                              isEdit
                                ? handleCancel
                                : () => handleDeleteItem(item?.id)
                            }
                          >
                            {isEdit ? t('buttons.cancel') : t('buttons.delete')}
                          </Button>
                          <LoadingButton
                            loading={isEdit && loadingEditItem}
                            variant="contained"
                            color="warning"
                            sx={{
                              bgcolor: primaryColor,
                              color: 'white',
                              mx: 1,
                            }}
                            onClick={
                              isEdit
                                ? () => handleProcess('edit')
                                : () => handleEditItem(item)
                            }
                          >
                            {isEdit ? t('buttons.confirm') : t('buttons.edit')}
                          </LoadingButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
        <Input
          value={newType}
          onChange={(e: any) => setNewType(e.target.value)}
        />
        <LoadingButton
          variant="contained"
          color="error"
          fullWidth
          loading={loadingAddNewType}
          onClick={() => handleProcess('add')}
        >
          {t('buttons.add')}
        </LoadingButton>
      </Stack>
    </Container>
  );
};

export default MenuEdit;
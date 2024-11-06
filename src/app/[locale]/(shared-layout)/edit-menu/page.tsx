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
import { fourthColor, primaryColor, secondaryColor } from '@/constant/color';
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
import { usePathname } from 'next/navigation';
import NoData from '@/components/NoData/NoData';

const MenuEdit = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [showEditMode, setShowEditMode] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentType, setCurrentType] = useState('');
  const [nameObj, setNameObj]: any = useState({ en: '', ar: '' });
  const [price, setPrice] = useState(0);
  const [uploadedFile, setUploadedFile] = useState('');

  const bodyAdd = {
    type: currentType,
    data: {
      _id: currentId,
      name: nameObj,
      price,
      image: uploadedFile,
    },
  };
  const [
    ,
    loadingAddItem,
    handleAddItem,
    successAddItem,
    successAddItemMessage,
    errorAddItemMessage,
  ] = usePost('/en/api/menu', bodyAdd);

  const [
    ,
    loadingEditItem,
    handleEditItemProcess,
    successEditItem,
    successEditItemMessage,
    errorEditItemMessage,
  ] = usePut('/en/api/menu', bodyAdd);
  const [
    ,
    loadingDeleteItem,
    handleDeleteItemProcess,
    successDeleteItem,
    successDeleteItemMessage,
    errorDeleteItemMessage,
  ] = useDelete('/en/api/menu', { itemId: currentId, type: currentType });

  const [menuItems, loading, getMenu, success] = useGet('/en/api/menu');

  useEffect(() => {
    getMenu();
  }, []);

  const labels = [
    t('table.id'),
    t('table.nameAR'),
    t('table.nameEN'),
    t('table.price'),
    t('table.image'),
    t('table.actions'),
  ];

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
    setNameObj({
      ar: item?.name?.ar,
      en: item?.name?.en,
    });
    setPrice(item?.price);
    setCurrentId(item?._id);
  };

  const handleCancel = () => {
    setShowAddItem(false);
    setShowEditMode(false);
    setShowDeleteConfirmation(false);
    setNameObj({ en: '', ar: '' });
    setPrice(0);
    setCurrentType('');
    setUploadedFile('');
    setCurrentId(0);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files;

    if (files) {
      for (const file of files) {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/*',
        ];

        if (allowedTypes.includes(file.type)) {
          if (file.size <= 1024 * 1024) {
            let fileConverted: any = await Base64(file);
            setUploadedFile(fileConverted);
          } else {
            setErrorMessage(t('messages.image-max-size-error'));
          }
        } else {
          setErrorMessage(t('messages.image-type-error'));
        }
      }
    }
    e.target.value = '';
  };

  const handleShowAdd = () => {
    handleCancel();
    setShowAddItem(true);
  };

  useEffect(() => {
    if (successDeleteItem || successAddItem || successEditItem) {
      handleCancel();
      getMenu();
    }
  }, [successAddItem, successDeleteItem, successEditItem]);

  /* Add or edit */
  const handleProcess = (process: string) => {
    if (!nameObj?.en || !nameObj?.ar) {
      setErrorMessage(t('messages.not-empty'));
      return;
    }
    if (process == 'edit') handleEditItemProcess();
    if (process == 'add') handleAddItem();
  };

  /* empty the error message */
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
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
        openAlert={
          Boolean(errorMessage) ||
          Boolean(errorDeleteItemMessage) ||
          Boolean(errorAddItemMessage) ||
          Boolean(errorEditItemMessage)
        }
        setOpenAlert={() => setErrorMessage('')}
        message={
          errorMessage ||
          errorDeleteItemMessage ||
          errorAddItemMessage ||
          errorEditItemMessage
        }
      />

      <CustomAlert
        openAlert={
          Boolean(successAddItemMessage) ||
          Boolean(successEditItemMessage) ||
          Boolean(successDeleteItemMessage)
        }
        type="success"
        setOpenAlert={() => {}}
        message={
          successAddItemMessage ||
          successEditItemMessage ||
          successDeleteItemMessage
        }
      />

      <Stack
        alignItems={'center'}
        py={3}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          color={secondaryColor}
        >
          {t('header.menu')}
        </Typography>

        {loading && menuItems.length == 0 ? (
          <Table sx={{ mt: 3 }}>
            {Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                {Array.from(new Array(6)).map((_, index) => (
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Table>
        ) : (
          menuItems &&
          menuItems.map((element: any) => {
            return (
              <Stack
                key={element?._id}
                width={'100%'}
                onClick={() => setCurrentType(element?.type)}
              >
                <Typography
                  variant="h5"
                  my={3}
                  color={fourthColor}
                  fontWeight={600}
                >
                  {element?.type?.[langCurrent]}
                </Typography>
                <TableContainer
                  sx={{ width: '100%' }}
                  component={Paper}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        {labels.map((label: any, i: number) => {
                          return (
                            <TableCell
                              key={i}
                              align="center"
                              sx={{
                                backgroundColor: secondaryColor,
                                color: 'white',
                              }}
                            >
                              {label}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {element?.data?.map((row: any, i: number) => {
                        let isEdit = showEditMode && row?._id == currentId;
                        let isFileUploaded =
                          uploadedFile && currentId == row?._id;
                        return (
                          <TableRow
                            key={i}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell align="center">{i + 1}</TableCell>
                            <TableCell align="center">
                              {isEdit ? (
                                <Input
                                  value={nameObj?.ar}
                                  onChange={(e: any) => {
                                    setNameObj((prev: any) => {
                                      return {
                                        ...prev,
                                        ar: e.target.value,
                                      };
                                    });
                                  }}
                                />
                              ) : (
                                row?.name?.ar
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {isEdit ? (
                                <Input
                                  value={nameObj?.en}
                                  onChange={(e: any) => {
                                    setNameObj((prev: any) => {
                                      return {
                                        ...prev,
                                        en: e.target.value,
                                      };
                                    });
                                  }}
                                />
                              ) : (
                                row?.name?.en
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {' '}
                              {isEdit ? (
                                <Input
                                  type="number"
                                  value={price}
                                  onChange={(e: any) => {
                                    setPrice(e.target.value);
                                  }}
                                />
                              ) : (
                                <Typography>
                                  {row?.price}
                                  <span style={{ fontWeight: '600' }}>$</span>
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Stack
                                direction={'row'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                {isEdit && (
                                  <Stack alignItems={'center'}>
                                    {' '}
                                    <input
                                      type="file"
                                      onChange={handleUploadFile}
                                      id="profile-input"
                                      hidden
                                      accept="image/*"
                                    />{' '}
                                    <label htmlFor="profile-input">
                                      <AddPhotoAlternateIcon
                                        sx={primaryObj}
                                        style={{ fontSize: 28, marginTop: 2 }}
                                      />
                                    </label>
                                    <ImageNotSupportedIcon
                                      sx={secondaryObj}
                                      onClick={() => setUploadedFile('')}
                                    />
                                  </Stack>
                                )}
                                <Image
                                  src={
                                    isFileUploaded ? uploadedFile : row.image
                                  }
                                  alt="img"
                                  width={40}
                                  height={40}
                                  style={{ borderRadius: 10 }}
                                />
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              {isEdit ? (
                                loadingEditItem ? (
                                  <CircularProgress
                                    color="error"
                                    size={20}
                                  />
                                ) : (
                                  <>
                                    {' '}
                                    <CancelIcon
                                      sx={secondaryObj}
                                      onClick={handleCancel}
                                    />
                                    <CheckCircleIcon
                                      sx={primaryObj}
                                      onClick={() => handleProcess('edit')}
                                    />
                                  </>
                                )
                              ) : (
                                <>
                                  <Delete
                                    onClick={() => handleDeleteItem(row?._id)}
                                    sx={secondaryObj}
                                  />
                                  <Edit
                                    sx={primaryObj}
                                    onClick={() => handleEditItem(row)}
                                  />
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* This row for add item */}
                      {showAddItem && currentType == element?.type ? (
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell align="center">#</TableCell>
                          <TableCell align="center">
                            <Input
                              value={nameObj?.ar}
                              onChange={(e: any) => {
                                setNameObj((prev: any) => {
                                  return {
                                    ...prev,
                                    ar: e.target.value,
                                  };
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Input
                              value={nameObj?.en}
                              onChange={(e: any) => {
                                setNameObj((prev: any) => {
                                  return {
                                    ...prev,
                                    en: e.target.value,
                                  };
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Input
                              type="number"
                              value={price}
                              onChange={(e: any) => {
                                setPrice(e.target.value);
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Stack
                              alignItems={'center'}
                              direction={
                                uploadedFile && currentId == 0
                                  ? 'column'
                                  : 'row'
                              }
                            >
                              {' '}
                              <input
                                type="file"
                                onChange={handleUploadFile}
                                id="profile-input"
                                hidden
                                accept="image/*"
                              />{' '}
                              <label htmlFor="profile-input">
                                <AddPhotoAlternateIcon
                                  sx={primaryObj}
                                  style={{ fontSize: 28, marginTop: 2 }}
                                />
                              </label>
                              <ImageNotSupportedIcon
                                sx={secondaryObj}
                                onClick={() => setUploadedFile('')}
                              />
                            </Stack>
                            {uploadedFile && currentId == 0 && (
                              <Image
                                src={uploadedFile}
                                alt="img"
                                width={40}
                                height={40}
                                style={{ borderRadius: 10 }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              sx={secondaryObj}
                              onClick={handleCancel}
                            >
                              {t('buttons.cancel')}
                            </Button>
                            <LoadingButton
                              sx={primaryObj}
                              loading={loadingAddItem}
                              onClick={() => handleProcess('add')}
                            >
                              {t('buttons.add')}
                            </LoadingButton>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          color={'error'}
                          onClick={handleShowAdd}
                          sx={{ background: secondaryColor, m: 2 }}
                        >
                          {t('buttons.add-item')}
                        </Button>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            );
          })
        )}
      </Stack>
      {success && menuItems.length == 0 && <NoData />}
    </Container>
  );
};

export default MenuEdit;

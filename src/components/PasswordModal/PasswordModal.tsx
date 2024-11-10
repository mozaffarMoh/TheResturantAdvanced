'use client';
import { primaryColor, secondaryColor } from '@/constant/color';
import useGet from '@/custom-hooks/useGet';
import usePost from '@/custom-hooks/usePost';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';

const PasswordModal = ({
  open,
  handleCancel,
  handleConfirm,
  loading = false,
  setErrorMessage,
  isAdminModal = false,
}: any) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  let isArabic = pathname.startsWith('/ar');
  let curretnLang = isArabic ? 'ar' : 'en';
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState('');

  const [
    ,
    loadingCheck,
    handleCheckPassword,
    successCheckPassword,
    ,
    errorCheckPasswordMessage,
  ] = useGet(`/en/api/password/${password}`);

  useEffect(() => {
    if (successCheckPassword) handleConfirm();
    if (errorCheckPasswordMessage) setErrorMessage(errorCheckPasswordMessage);
  }, [successCheckPassword, errorCheckPasswordMessage]);

  const handleBackHome = () => {
    router.push(`/${curretnLang}`);
  };
  return (
    <Dialog
      className="logout-alert"
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>{t('messages.password-confirm')}</DialogTitle>{' '}
      <Stack
        alignItems={'center'}
        px={3}
        py={1}
      >
        <TextField
          label={t('labels.password')}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={false}
          InputLabelProps={{
            shrink: Boolean(password) || isFocused,
            sx: {
              right: isArabic ? 30 : '',
              left: isArabic ? 'auto' : '',
              transformOrigin: isArabic ? 'top right' : '',
              textAlign: isArabic ? 'right' : 'left',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline legend': {
              textAlign: isArabic ? 'right' : 'left',
            },
            '& .MuiFormLabel-root': {
              textAlign: isArabic ? 'right' : 'left',
              '&.MuiInputLabel-shrink': {
                color: 'initial',
                marginLeft: isArabic ? 24 : 0,
              },
            },
          }}
          fullWidth
          onChange={(e: any) => setPassword(e.target.value)}
        />
      </Stack>
      <DialogActions
        sx={{ justifyContent: 'center', gap: 2, direction: 'ltr' }}
      >
        <LoadingButton
          loading={loading || loadingCheck}
          variant="contained"
          onClick={password ? handleCheckPassword : null}
          sx={{
            background: primaryColor,
            '&:hover': { background: primaryColor },
          }}
        >
          {t('buttons.confirm')}
        </LoadingButton>
        <Button
          variant="contained"
          onClick={isAdminModal ? handleBackHome : handleCancel}
          sx={{
            background: secondaryColor,
            '&:hover': { background: secondaryColor },
          }}
        >
          {isAdminModal ? t('buttons.backToHome') : t('buttons.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordModal;

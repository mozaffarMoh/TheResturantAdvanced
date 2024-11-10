import { secondaryColor } from '@/constant/color';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

const EnterName = ({ setIsNameEntered, cashierName, setCashierName }: any) => {
  const t = useTranslations();
  const handleStart = () => {
    if (cashierName) {
      Cookies.set('cashierName', cashierName);
      setIsNameEntered(true);
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{ bgcolor: 'whitesmoke', height: 300, borderRadius: 5 }}
    >
      <Stack
        justifyContent={'center'}
        textAlign={'center'}
        height={'100%'}
        gap={1}
      >
        <h4>{t('labels.enterName')}</h4>
        <TextField
          fullWidth
          value={cashierName}
          onChange={(e: any) => setCashierName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleStart}
          sx={{
            background: secondaryColor,
            '&:hover': { background: secondaryColor },
          }}
        >
          {t('buttons.start')}
        </Button>
      </Stack>
    </Container>
  );
};

export default EnterName;

import { primaryColor } from '@/constant/color';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const NoData = () => {
  const t = useTranslations();
  return (
    <Stack
      height={200}
      width={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Typography
        color={primaryColor}
        fontSize={30}
      >
        {t('messages.no-data')}
      </Typography>
    </Stack>
  );
};

export default NoData;

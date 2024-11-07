import { secondaryColor, thirdColor } from '@/constant/color';
import { Alert, Snackbar, SnackbarOrigin, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

interface IProps {
  openAlert: boolean;
  setOpenAlert: (open: boolean) => void;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  position?: SnackbarOrigin;
}
const CustomAlert = ({
  openAlert,
  setOpenAlert,
  message,
  type = 'error',
  position = { vertical: 'top', horizontal: 'right' },
}: IProps) => {
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  const reverseDirection = langCurrent == 'en' ? 'rtl' : 'ltr';
  const horizontalDirection = langCurrent == 'ar' ? 'right' : 'left';

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: horizontalDirection }}
      open={openAlert}
      onClose={() => setOpenAlert(false)}
      autoHideDuration={6000}
    >
      <Alert
        onClose={() => setOpenAlert(false)}
        severity={type}
        variant="filled"
        sx={{
          width: '100%',
          minHeight: '4rem',
          fontSize: '1.1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          background: type == 'success' ? thirdColor : '',
          direction: reverseDirection,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;

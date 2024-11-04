import { Skeleton } from '@mui/material';

const CustomSkeleton = ({
  width = '100px',
  height = '30px',
  bgcolor = '',
  borderRadius = '',
  variant = 'text',
}: any) => {
  return (
    <Skeleton
      sx={{ bgcolor: bgcolor, borderRadius: borderRadius }}
      variant={variant}
      width={width}
      height={height}
    />
  );
};

export default CustomSkeleton;

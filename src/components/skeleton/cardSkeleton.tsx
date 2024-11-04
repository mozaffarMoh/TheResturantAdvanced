import { Box, Skeleton, Stack } from '@mui/material';

const CardSkeleton = ({ height = '' }: any) => {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      padding={2}
      bgcolor={'whitesmoke'}
      borderRadius={3}
      height={'200px'}
    >
      <Skeleton
        variant="rectangular"
        width={250}
        height={118}
      />
      <Box sx={{ pt: 0.5 }}>
        <Skeleton width="150px" />
        <Skeleton width="250px" />
      </Box>
    </Stack>
  );
};

export default CardSkeleton;

import { Box, Skeleton, Stack } from '@mui/material';

const CardSkeletonVertical = ({
  avatar,
  fullFlex = 'flex-start',
  width = 'auto',
}: any) => {
  return (
    <Stack
      spacing={2}
      alignItems={fullFlex}
      padding={2}
      bgcolor={'whitesmoke'}
      borderRadius={3}
      width={width}
    >
      {avatar ? (
        <Skeleton
          variant="circular"
          width={100}
          height={100}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width={240}
          height={200}
          sx={{ borderRadius: 4 }}
        />
      )}
      <Box sx={{ pt: 0.5 }}>
        <Skeleton width="150px" />
        <Skeleton width="200px" />
        <Skeleton width="200px" />
      </Box>
    </Stack>
  );
};

export default CardSkeletonVertical;

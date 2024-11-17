'use client';
import useGet from '@/custom-hooks/useGet';
import './MenuList.scss';
import { useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CustomSkeleton from '../skeleton/CustomSkeleton';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const MenuList = ({ setBillData, chosenCount, setChosenCount }: any) => {
  const t = useTranslations();
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  let isArabic = langCurrent == 'ar' ? true : false;
  const [menuItems, loading, getMenu, success] = useGet('/en/api/menu');

  useEffect(() => {
    getMenu();
  }, []);

  const handleAddItem = (item: any) => {
    if (chosenCount > 0) {
      setBillData((prevArr: any) => {
        let newArr = [...prevArr];
        if (!newArr.some((ele) => ele?._id == item?._id)) {
          newArr.push({ ...item, count: chosenCount });
        } else {
          newArr = newArr.map((ele: any) => {
            const isExist = ele?._id == item?._id;
            const count = !isExist ? ele?.count : ele?.count + chosenCount;
            return {
              ...ele,
              count: count,
            };
          });
        }
        return newArr;
      });
    }
  };

  const handleChooseCount = (event: any) => {
    const val = Number(event.target.value);
    if (val > 0 && val <= 1000) {
      setChosenCount(val);
    }
  };

  return (
    <div
      className="MenuList"
      style={{ position: 'relative' }}
    >
      {/* choose count */}
      <Box
        position={'sticky'}
        top={2}
        left={2}
        zIndex={2}
      >
        <TextField
          type="number"
          value={chosenCount}
          onChange={handleChooseCount}
          label={t('labels.count')}
          color="warning"
          InputLabelProps={{
            sx: {
              right: isArabic ? 30 : '',
              left: isArabic ? 'auto' : '',
              transformOrigin: isArabic ? 'top right' : '',
              textAlign: isArabic ? 'right' : 'left',
            },
          }}
          sx={{
            m: 2,
            '& .MuiOutlinedInput-notchedOutline legend': {
              textAlign: isArabic ? 'right' : 'left',
            },
            '& .MuiFormLabel-root': {
              textAlign: isArabic ? 'right' : 'left',
            },
            bgcolor: 'white',
          }}
        />
      </Box>
      {loading ? (
        <Stack
          padding={2}
          gap={2}
        >
          {Array.from(new Array(3)).map((_, index) => (
            <Stack key={index}>
              <CustomSkeleton width={200} />
              <Stack
                direction={'row'}
                padding={2}
                flexWrap={'wrap'}
                gap={2}
              >
                {Array.from(new Array(4)).map((_, index) => (
                  <CustomSkeleton
                    height={200}
                    width={120}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        menuItems &&
        menuItems?.map((element: any) => {
          return (
            <div
              className="items"
              key={element?._id}
            >
              <Typography
                variant="h5"
                color="GrayText"
                fontWeight={600}
              >
                {element?.type?.[langCurrent]}
              </Typography>
              <div className="items-template flexStart">
                {element?.data?.map((item: any) => {
                  return (
                    <div
                      className="item flexCenterColumn"
                      key={item?._id}
                      onClick={() => handleAddItem(item)}
                    >
                      <div>
                        <img src={item.image} />
                        <div>
                          <p>{item.name?.[langCurrent]}</p>
                          <p>{item.price}$</p>
                        </div>
                      </div>{' '}
                    </div>
                  );
                })}
              </div>
              <br />
              <hr />
            </div>
          );
        })
      )}
    </div>
  );
};

export default MenuList;

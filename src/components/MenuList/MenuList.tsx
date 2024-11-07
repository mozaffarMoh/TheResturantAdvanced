'use client';
import useGet from '@/custom-hooks/useGet';
import './MenuList.scss';
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import CustomSkeleton from '../skeleton/CustomSkeleton';
import { usePathname } from 'next/navigation';

const MenuList = ({ setBillData, billData }: any) => {
  const pathname = usePathname();
  const langCurrent = pathname?.slice(1, 3) || 'en';
  const [menuItems, loading, getMenu, success] = useGet('/en/api/menu');

  useEffect(() => {
    getMenu();
  }, []);

  const handleAddItem = (item: any) => {
    setBillData((prevArr: any) => {
      let newArr = [...prevArr];
      if (!newArr.some((ele) => ele?._id == item?._id)) {
        newArr.push({ ...item, count: 1 });
      } else {
        newArr = newArr.map((ele: any) => {
          const isExist = ele?._id == item?._id;
          const count = !isExist ? ele?.count : ele?.count + 1;
          return {
            ...ele,
            count: count,
          };
        });
      }
      return newArr;
    });
  };
  

  return (
    <div className="MenuList">
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
                      <img src={item.image} />
                      <div>
                        <p>{item.name?.[langCurrent]}</p>
                        <p>{item.price}$</p>
                      </div>
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

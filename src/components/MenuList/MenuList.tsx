'use client';
import useGet from '@/custom-hooks/useGet';
import './MenuList.scss';
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { menu } from '@/app/[locale]/(shared-layout)/edit-menu/menuArr';
import { Skeleton } from 'antd';
import CustomSkeleton from '../skeleton/CustomSkeleton';

const MenuList = () => {
  const [menuItems, loading, getMenu, success] = useGet('/en/api/menu');

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div className="MenuList">
      {loading ? (
        <Stack
          padding={2}
          gap={2}
        >
          {Array.from(new Array(3)).map((_, index) => (
            <Stack key={index}>
              <CustomSkeleton width={200}/>
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
                {element?.type}
              </Typography>
              <div className="items-template flexStart">
                {element?.data?.map((item: any) => {
                  return (
                    <div
                      className="item flexBetweenColumn"
                      key={item?._id}
                    >
                      <img src={item.image} />
                      <div>
                        <p>{item.name}</p>
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

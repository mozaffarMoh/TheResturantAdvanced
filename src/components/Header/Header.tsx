'use client';
import { Drawer, Stack, useMediaQuery } from '@mui/material';
import './Header.scss';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import { Button } from '@mui/material';
import { fourthColor, secondaryColor } from '@/constant/color';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  let pathname = usePathname();
  let currentLang = pathname.slice(1, 3);
  let pathParts = pathname.split('/');
  let currentRoute: any =
    pathParts.length > 2 ? '/' + pathParts[pathParts.length - 1] : '/';
  const [showDrawer, setShowDrawer] = useState(false);
  const isScreen600 = useMediaQuery('(max-width:600px)');

  const buttons = [
    {
      label: 'header.bills', // Text key for translation
      link: '/bills', // Path for redirection
      color: 'error', // Color variant for the button
    },
    {
      label: 'header.types',
      link: '/types',
      color: 'error',
    },
    {
      label: 'header.menu',
      link: '/edit-menu',
      color: 'error',
    },
    {
      label: 'header.main',
      link: '/',
      color: 'error',
    },
  ];

  let ButtonsComponent = () =>
    buttons.map((button: any, index: number) => {
      let isActive = currentRoute == button.link;
      return (
        <Button
          href={`/${currentLang}${button.link}`}
          key={index}
          variant="contained"
          color={button.color}
          sx={{
            background: isActive ? fourthColor : secondaryColor,
            borderRadius: '15px',
            ':hover': {
              background: isActive ? fourthColor : 'error',
            },
          }}
          // onClick={() => router.push(`/${currentLang}${button.link}`)}
        >
          {t(button.label)}
        </Button>
      );
    });

  let ButtonsComponentResponsive = () =>
    [...buttons].reverse().map((button: any, index: number) => {
      let isActive = currentRoute == button.link;
      return (
        <Button
          key={index}
          variant="contained"
          color={button.color}
          sx={{
            background: isActive ? fourthColor : secondaryColor,
            width: 200,
            height: 50,
            m: 1,
            ':hover': {
              background: isActive ? fourthColor : 'error',
            },
          }}
          onClick={() => router.push(`/${currentLang}${button.link}`)}
        >
          {t(button.label)}
        </Button>
      );
    });

  return (
    <Stack
      p={2}
      direction={'row'}
      justifyContent={'space-between'}
    >
      <LanguageToggle />

      <Stack
        direction="row"
        gap={2}
      >
        {isScreen600 ? (
          <MenuIcon
            onClick={() => setShowDrawer(true)}
            sx={{ color: secondaryColor, fontSize: 35, cursor: 'pointer' }}
          />
        ) : (
          <ButtonsComponent />
        )}
      </Stack>

      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <ButtonsComponentResponsive />
      </Drawer>
    </Stack>
  );
};

export default Header;

'use client';

import { Typography, Button } from 'antd';
import { SwitchTheme } from './switchTheme/SwitchTheme';
import { useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import './header.css';

const { Title } = Typography;

export const Header = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className='header'>
      <div className='header_inner'>
        <Title level={5} onClick={() => router.push('/')} className='header_title'>
          Home
        </Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            iconPosition='start'
            icon={<PlusCircleOutlined style={{ fontSize: '20px' }} />}
            className='header_new_user_button'
            onClick={() => router.push('/newUser')}
          >
            New User
          </Button>
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
};

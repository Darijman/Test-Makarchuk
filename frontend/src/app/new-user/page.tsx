'use client';

import { Typography } from 'antd';
import './newUser.css';

const { Title } = Typography;

const NewUser = () => {
  return (
    <div>
      <Title level={1} style={{ margin: 0, textAlign: 'center' }}>
        New User
      </Title>
    </div>
  );
};

export default NewUser;

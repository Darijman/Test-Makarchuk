'use client';

import { Typography } from 'antd';
import { CreateNewUserForm } from './createNewUserForm/CreateNewUserForm';

const { Title } = Typography;

const NewUser = () => {
  return (
    <div>
      <Title level={1} style={{ margin: '0px 0px 20px 0px', textAlign: 'center' }}>
        New User
      </Title>
      <CreateNewUserForm />
    </div>
  );
};

export default NewUser;

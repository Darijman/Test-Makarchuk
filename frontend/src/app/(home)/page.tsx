'use client';

import { UserCard } from '@/components/userCard/UserCard';
import { Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useEffect } from 'react';
import { getUsers } from '@/store/slices/usersSlice/usersRequests';
import './home.css';

const { Title } = Typography;

export default function Home() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.usersSlice);

  useEffect(() => {
    dispatch(getUsers({}));
  }, [dispatch]);

  console.log(`users`, users);

  return (
    <div>
      <Title level={1} style={{ margin: '0px 0px 20px 0px', textAlign: 'center' }}>
        Home
      </Title>
      <div className='home_users_grid'>
        {users.map((user) => {
          return <UserCard key={user.id} user={user} />;
        })}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { message, Pagination, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { deleteUser, getUsers } from '@/store/slices/usersSlice/usersRequests';
import { UserCard } from '@/components/userCard/UserCard';
import { Loader } from '@/ui/loader/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import './home.css';
import './responsive.css';

const { Title } = Typography;
const USERS_PER_PAGE: number = 15;

export default function Home() {
  const dispatch = useAppDispatch();
  const { deletionError, isLoading, users, totalUsers, usersError } = useAppSelector((state) => state.usersSlice);
  const [isUserDeleting, setIsUserDeleting] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2, duration: 3 });

  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get('page') || '1', 10);
  const offset: number = (page - 1) * USERS_PER_PAGE;

  useEffect(() => {
    dispatch(getUsers({ offset, limit: USERS_PER_PAGE }));
  }, [dispatch, offset]);

  const onDeleteUserHandler = async (userId: number) => {
    setIsUserDeleting(true);
    try {
      await dispatch(deleteUser(userId)).unwrap();
      messageApi.success('The user was deleted successfully!');
    } catch {
      messageApi.error('Something went wrong! Try again later..');
    } finally {
      setIsUserDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (usersError)
      return (
        <Title level={3} style={{ textAlign: 'center', color: 'var(--red-color)' }}>
          {usersError}
        </Title>
      );
    if (!users.length)
      return (
        <Title level={3} style={{ textAlign: 'center', color: 'var(--red-color)' }}>
          There is nothing here
        </Title>
      );

    return (
      <>
        <div className='home_users_grid'>
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  delay: index < 6 ? index * 0.03 : 0.15,
                  duration: 0.2,
                }}
              >
                <UserCard
                  user={user}
                  isDeleting={isUserDeleting}
                  onDelete={() => onDeleteUserHandler(user.id)}
                  deletionError={deletionError}
                  preview={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Pagination
            className='custom_pagination'
            current={page}
            pageSize={USERS_PER_PAGE}
            total={totalUsers}
            onChange={(newPage) => router.push(`/?page=${newPage}`)}
          />
        </div>
      </>
    );
  };

  return (
    <div>
      {contextHolder}
      <Title level={1} style={{ margin: '0 0 20px', textAlign: 'center' }}>
        Home
      </Title>
      {renderContent()}
    </div>
  );
}

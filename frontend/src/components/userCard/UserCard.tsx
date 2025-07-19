'use client';

import { useEffect, useState } from 'react';
import { Avatar, Button, Tooltip, Typography } from 'antd';
import { User } from '@/interfaces/user';
import { FaWeight } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { FaMale, FaFemale } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { BASE_URL } from '../../../axiosConfig';
import { DeleteModal } from '../deleteModal/DeleteModal';
import { EditUserModal } from '../editUserModal/EditUserModal';
import { formatDate } from '@/helpers/formatDate';
import './userCard.css';
import './responsive.css';

const { Title, Text } = Typography;

interface Props {
  user: User;
  onDelete: (userId: number) => void;
  isDeleting?: boolean;
  deletionError?: string;
  preview?: boolean;
  previewImage?: any;
}

export const UserCard = ({ user, onDelete, isDeleting, deletionError, preview, previewImage }: Props) => {
  const { id, name, surname, weight, height, sex, address, imagePath, createdAt } = user;

  const [avatarSrc, setAvatarSrc] = useState<string>('/default-avatar.svg');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useEffect(() => {
    if (previewImage) {
      const objectUrl = URL.createObjectURL(previewImage);
      setAvatarSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (imagePath) {
      setAvatarSrc(`${BASE_URL}/uploads/${imagePath}`);
    } else {
      setAvatarSrc('/default-avatar.svg');
    }
  }, [previewImage, imagePath]);

  return (
    <div className='user_card'>
      <Text className='user_card_date_created'>{formatDate(createdAt)}</Text>
      <div>
        <Avatar
          src={avatarSrc}
          onError={() => {
            setAvatarSrc('/default-avatar.svg');
            return false;
          }}
          size={120}
          className='user_card_avatar'
          draggable={false}
        />
        {preview ? null : (
          <>
            <Button
              className='user_card_edit_button'
              icon={<FaEdit size={24} fill='var(--submit-button-color)' />}
              iconPosition='start'
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              className='user_card_delete_button'
              icon={<MdDelete size={24} fill='var(--red-color)' />}
              iconPosition='start'
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
      <div>
        <ul className='user_card_list'>
          <li className='user_card_list_item'>
            <Title level={3} className='user_card_name'>
              {name}
            </Title>
          </li>
          <li className='user_card_list_item'>
            <Title level={3} className='user_card_surname'>
              {surname}
            </Title>
          </li>
          <li className='user_card_list_item'>
            <GiBodyHeight style={{ marginRight: '20px', fontSize: '30px' }} />
            <Text className='user_card_list_item_text'>Height: {height}cm</Text>
          </li>
          <li className='user_card_list_item'>
            <FaWeight style={{ marginRight: '20px', fontSize: '30px' }} />
            <Text className='user_card_list_item_text'>Weight: {weight}kg</Text>
          </li>
          <li className='user_card_list_item'>
            {sex === 'MALE' ? (
              <FaMale style={{ marginRight: '20px', fontSize: '30px' }} />
            ) : (
              <FaFemale style={{ marginRight: '20px', fontSize: '30px' }} />
            )}
            <Text className='user_card_list_item_text'>Sex: {sex}</Text>
          </li>
          <li className='user_card_list_item'>
            <FaMapMarkerAlt style={{ marginRight: '20px', fontSize: '30px', flexShrink: 0 }} />
            <Tooltip title={address}>
              <Text className='user_card_list_item_text'>Address: {address}</Text>
            </Tooltip>
          </li>
        </ul>
      </div>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => onDelete(id)}
        title='Do you really want to delete this user?'
        text='This action can not be undone!'
        deleteButtonText='Yes, delete him'
        isDeleting={isDeleting}
        errorMessage={deletionError}
      />

      <EditUserModal open={showEditModal} onClose={() => setShowEditModal(false)} user={user} />
    </div>
  );
};

'use client';

import { Avatar, Button, Tooltip, Typography } from 'antd';
import { User } from '@/interfaces/user';
import { FaWeight } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { FaMale, FaFemale } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { BASE_URL } from '../../../axiosConfig';
import './userCard.css';

const { Title, Text } = Typography;

interface Props {
  user: User;
}

export const UserCard = ({ user }: Props) => {
  const { id, name, surname, weight, height, sex, address, imagePath, createdAt, updatedAt } = user;
  const image = `${BASE_URL}/uploads/${imagePath}`;

  return (
    <div className='user_card'>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
        <div>
          <Avatar
            src={image}
            size={120}
            style={{ backgroundColor: 'var(--background-color)', flexShrink: 0, margin: '0px 20px 20px 0px' }}
            draggable={false}
          />
          <Button className='user_card_edit_button' icon={<FaEdit size={24} fill='var(--submit-button-color)' />} iconPosition='start'>
            Edit
          </Button>
          <Button className='user_card_delete_button' icon={<MdDelete size={24} fill='var(--red-color)' />} iconPosition='start'>
            Delete
          </Button>
        </div>
        <div>
          <ul className='user_card_list'>
            <li className='user_card_list_item' style={{ margin: 0 }}>
              <Title level={3} style={{ margin: '0px 0px 0px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name}
              </Title>
            </li>
            <li className='user_card_list_item'>
              <Title level={3} style={{ margin: '0px 0px 10px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
      </div>
    </div>
  );
};

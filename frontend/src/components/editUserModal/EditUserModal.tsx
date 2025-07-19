'use client';

import { useEffect, useState } from 'react';
import { Modal as AntdModal, Button, Form, message } from 'antd';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { FaUserEdit } from 'react-icons/fa';
import { CreateNewUserForm, ICreateNewUserForm } from '@/app/newUser/createNewUserForm/CreateNewUserForm';
import { UserCard } from '../userCard/UserCard';
import { User } from '@/interfaces/user';
import { editUser } from '@/store/slices/usersSlice/usersRequests';
import { areUsersEqual } from '@/helpers/areUsersEqual';
import './editUserModal.css';
import './responsive.css';

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export const EditUserModal = ({ open, onClose, user }: Props) => {
  const dispatch = useAppDispatch();

  const [editedUser, setEditedUser] = useState<User>(user);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2, duration: 5 });
  const [form] = Form.useForm<ICreateNewUserForm>();

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (open) {
      setEditedUser(user);
      setPreviewImage(null);
      setIsChanged(false);
      setIsFormValid(false);
      form.resetFields();
    }
  }, [open, user, form]);

  useEffect(() => {
    if (!open) return;

    const checkFormValidity = async () => {
      const isImageChanged = !!previewImage;
      const isUserDataChanged = !areUsersEqual(user, editedUser);

      setIsChanged(isUserDataChanged || isImageChanged);

      try {
        await form.validateFields();
        setIsFormValid(true);
      } catch {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [editedUser, previewImage, user, open, form]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('surname', values.surname);
      formData.append('weight', values.weight.toString());
      formData.append('height', values.height.toString());
      formData.append('sex', values.sex);
      formData.append('address', values.address);

      const imageFile = values.image?.[0]?.originFileObj;
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      await dispatch(editUser({ userId: user.id, formData })).unwrap();

      messageApi.open({
        type: 'success',
        content: 'The user was updated successfully!',
      });
      onClose();
    } catch {
      messageApi.open({
        type: 'error',
        content: 'Something went wrong! Try again later..',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AntdModal title='Edit User' open={open} centered footer={null} onCancel={handleCancel} wrapClassName='edit_user_custom_modal'>
      {contextHolder}
      <div className='edit_user_custom_modal_content'>
        <FaUserEdit style={{ width: '100px', height: '100px', margin: 0 }} />

        <div className='edit_user_custom_modal_main'>
          <div className='edit_user_form_wrapper'>
            <CreateNewUserForm
              edit={true}
              editedUser={editedUser}
              formInstance={form}
              onImageChange={(file: File | null) => setPreviewImage(file)}
              onChange={(values) => {
                setEditedUser((prev) => ({
                  ...prev,
                  ...values,
                  imagePath: prev.imagePath,
                }));
              }}
            />
          </div>
          <UserCard onDelete={() => {}} user={editedUser} preview={true} previewImage={previewImage} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button onClick={handleCancel} style={{ marginRight: '20px' }}>
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={handleSave}
            loading={isSaving}
            disabled={!isChanged || !isFormValid}
            className='edit_user_save_button'
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AntdModal>
  );
};

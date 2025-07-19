'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { InputField } from '@/components/inputField/InputField';
import { Typography, Form, Upload, Button, message, FormInstance } from 'antd';
import { Select } from '@/components/select/Select';
import { UploadOutlined } from '@ant-design/icons';
import { SEX, User } from '@/interfaces/user';
import { BASE_URL } from '../../../../axiosConfig';
import { createUser } from '@/store/slices/usersSlice/usersRequests';
import type { UploadFile } from 'antd';
import './createNewUserForm.css';

const { Paragraph } = Typography;

const selectOptions: { value: string; label: string }[] = [
  { value: SEX.MALE, label: SEX.MALE },
  { value: SEX.FEMALE, label: SEX.FEMALE },
];

export interface ICreateNewUserForm {
  name: string;
  surname: string;
  weight: number;
  height: number;
  sex: SEX;
  address: string;
  image: UploadFile[];
}

interface Props {
  style?: React.CSSProperties;
  edit?: boolean;
  editedUser?: User;
  onChange?: (user: Partial<User>) => void;
  onImageChange?: (file: File | null) => void;
  formInstance?: FormInstance<ICreateNewUserForm>;
}

export const CreateNewUserForm = ({ style, edit, editedUser, onChange, onImageChange, formInstance }: Props) => {
  const dispatch = useAppDispatch();
  const [innerForm] = Form.useForm<ICreateNewUserForm>();
  const form = formInstance || innerForm;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2, duration: 5 });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editedUser?.imagePath) {
      setFileList([
        {
          uid: '-1',
          name: 'profile.jpg',
          status: 'done',
          url: `${BASE_URL}/uploads/${editedUser.imagePath}`,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [editedUser]);

  const onFinishFailed = () => {
    setIsSubmitted(true);
  };

  const onFinish = async (values: ICreateNewUserForm) => {
    setIsSubmitted(true);
    setIsSubmitting(true);

    const imageFile = values.image?.[0]?.originFileObj;
    if (!imageFile) {
      messageApi.error('Please upload an image');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('surname', values.surname);
    formData.append('weight', values.weight.toString());
    formData.append('height', values.height.toString());
    formData.append('sex', values.sex);
    formData.append('address', values.address);
    formData.append('image', imageFile);

    try {
      await dispatch(createUser(formData)).unwrap();

      messageApi.open({
        type: 'success',
        content: 'The user was created successfully!',
      });
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      console.log(`error`, error);

      messageApi.open({
        type: 'error',
        content: error.error || 'Something went wrong! Try again later..',
      });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  return (
    <div className='create_new_user_form' style={style}>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        style={{ width: '100%' }}
        initialValues={{
          name: editedUser?.name,
          surname: editedUser?.surname,
          weight: editedUser?.weight,
          height: editedUser?.height,
          sex: editedUser?.sex,
          address: editedUser?.address,
          image: editedUser?.imagePath
            ? [
                {
                  uid: '-1',
                  name: 'profile.jpg',
                  status: 'done',
                  url: `${BASE_URL}/uploads/${editedUser.imagePath}`,
                },
              ]
            : [],
        }}
        onValuesChange={(_, allValues) => {
          onChange?.(allValues);
        }}
      >
        <Form.Item
          name='name'
          rules={[
            { required: true, message: '' },
            {
              min: 2,
              max: 40,
              message: 'Name must be between 2 and 40 characters!',
            },
          ]}
        >
          <InputField placeHolder='Name*' minLength={2} maxLength={40} />
        </Form.Item>

        <Form.Item
          name='surname'
          rules={[
            { required: true, message: '' },
            {
              min: 2,
              max: 40,
              message: 'Surname must be between 2 and 40 characters!',
            },
          ]}
        >
          <InputField placeHolder='Surname*' minLength={2} maxLength={40} />
        </Form.Item>

        <Form.Item
          name='weight'
          rules={[
            {
              required: true,
              message: '',
            },
            {
              pattern: /^\d+(\.\d)?$/,
              message: 'Weight must be a number (e.g. 70 or 60.5)',
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const weight = parseFloat(value);
                if (isNaN(weight) || weight < 30 || weight > 300) {
                  return Promise.reject('Weight must be between 30 and 300 kg!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputField
            placeHolder='Weight'
            maxLength={5}
            inputMode='decimal'
            suffix='kg'
            onKeyDown={(e) => {
              const key = e.key;
              const value = e.currentTarget.value;

              if (key.length === 1) {
                if (!/\d/.test(key) && key !== '.') {
                  e.preventDefault();
                  return;
                }

                if (key === '.' && value.includes('.')) {
                  e.preventDefault();
                  return;
                }

                const [_, decimal = ''] = value.split('.');
                if (value.includes('.') && decimal.length >= 1 && /\d/.test(key)) {
                  e.preventDefault();
                  return;
                }
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text');
              if (!/^\d+(\.\d)?$/.test(pasted)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name='height'
          rules={[
            {
              required: true,
              message: '',
            },
            {
              pattern: /^\d+$/,
              message: 'Height must be a whole number (e.g. 175)',
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const height = parseInt(value, 10);
                if (isNaN(height) || height < 50 || height > 300) {
                  return Promise.reject('Height must be between 50 and 300 cm!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputField
            placeHolder='Height*'
            minLength={2}
            maxLength={3}
            inputMode='numeric'
            suffix='cm'
            onKeyDown={(e) => {
              const key = e.key;
              if (key.length === 1 && !/\d/.test(key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text');
              if (!/^\d+$/.test(pasted)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name='address'
          rules={[
            { required: true, message: '' },
            {
              min: 5,
              max: 150,
              message: 'Address must be between 5 and 150 characters!',
            },
          ]}
        >
          <InputField placeHolder='Address*' minLength={5} maxLength={150} />
        </Form.Item>

        <Form.Item name='sex' rules={[{ required: true, message: '' }]}>
          <Select placeholder='Select Your Sex*' className='history_select_category' options={selectOptions} style={{ height: '40px' }} />
        </Form.Item>

        <Form.Item
          name='image'
          valuePropName='fileList'
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList?.slice(-1);
          }}
          rules={[{ required: true, message: '' }]}
        >
          <Upload.Dragger
            name='avatar'
            listType='picture'
            fileList={fileList}
            beforeUpload={(file) => {
              onImageChange?.(file);
              return false;
            }}
            maxCount={1}
            accept='.jpg,.jpeg,.png,.svg,.avif'
            onChange={({ fileList: newFileList }) => {
              const lastFile = newFileList.slice(-1);
              setFileList(lastFile);
              form.setFieldsValue({ image: lastFile });
            }}
            onRemove={() => {
              setFileList([]);
              form.setFieldsValue({ image: [] });
              return true;
            }}
            defaultFileList={
              editedUser?.imagePath
                ? [
                    {
                      uid: '-1',
                      name: 'profile.jpg',
                      status: 'done',
                      url: `${BASE_URL}/uploads/${editedUser.imagePath}`,
                    },
                  ]
                : []
            }
            style={{
              border: isSubmitted && !fileList.length ? '2px solid var(--red-color)' : '2px solid var(--foreground-color)',
            }}
          >
            <p className='ant-upload-drag-icon'>
              <UploadOutlined />
            </p>
            <Paragraph>Click or drag image to upload</Paragraph>
            <Paragraph style={{ color: 'var(--red-color)' }}>Only one image is allowed!</Paragraph>
          </Upload.Dragger>
        </Form.Item>

        {edit ? null : (
          <Form.Item>
            <Button htmlType='submit' type='primary' style={{ width: '100%', height: '35px' }} loading={isSubmitting}>
              Create New User
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

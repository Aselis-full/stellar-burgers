import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectUser, updateUser } from '../../services/userSlice';
import { Preloader } from '@ui';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) || null;

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }));
  }, [user]);

  if (!user) {
    return <Preloader />;
  }

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      const updatedData: Partial<TRegisterData> = {
        name: formValue.name,
        email: formValue.email
      };
      if (formValue.password) {
        updatedData.password = formValue.password;
      }
      dispatch(updateUser(updatedData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

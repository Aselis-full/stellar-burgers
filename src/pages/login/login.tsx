import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  loginUser,
  selectUserError
} from '../../services/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const error = useSelector(selectUserError);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(
    () => () => {
      dispatch(clearUserError());
    },
    [dispatch]
  );
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const loginData: { email: string; password: string } = {
      email: email,
      password: password
    };
    dispatch(loginUser(loginData));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

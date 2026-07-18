import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(selectUser)?.name;
  return <AppHeaderUI userName={name} />;
};

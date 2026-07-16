import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  let path = '';
  if (userName === undefined) {
    path = '/login';
  } else {
    path = '/profile';
  }
  const location = useLocation();
  const currentPath = location.pathname;
  const isConstructorActive = currentPath === '/';
  const isFeedActive = currentPath.startsWith('/feed');
  const isAccountActive =
    currentPath.startsWith('/profile') || currentPath.startsWith('/login');
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.link_active}`
                : `${styles.link}`
            }
            to={'/'}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.link_active}`
                : `${styles.link}`
            }
            to={'/feed'}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.link_active} ${styles.link_position_last}`
              : `${styles.link} ${styles.link_position_last}`
          }
          to={path}
        >
          <ProfileIcon type={isAccountActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};

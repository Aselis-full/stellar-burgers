import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeed, selectFeed } from '../../services/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const handleGetFeeds = useCallback(() => {
    dispatch(getFeed());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(selectFeed).orders;

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

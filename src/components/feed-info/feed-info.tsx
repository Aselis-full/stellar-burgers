import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed } from '../../services/orderSlice';
import { useMemo } from 'react';
import { Preloader } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeed);
  const orders = useMemo(() => feed?.orders || [], [feed?.orders]);
  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);

  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);
  if (!feed) {
    return <Preloader />;
  }
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

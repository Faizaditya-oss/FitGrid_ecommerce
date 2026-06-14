import { productsData } from '../data/products';
import { initialUsers } from '../data/users';
import { ordersData } from '../data/orders';
import { initialPayments } from '../data/payments';

export const initApp = () => {
  if (!localStorage.getItem('fitgrid_products')) {
    localStorage.setItem('fitgrid_products', JSON.stringify(productsData));
  }
  if (!localStorage.getItem('fitgrid_users')) {
    localStorage.setItem('fitgrid_users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('fitgrid_orders')) {
    localStorage.setItem('fitgrid_orders', JSON.stringify(ordersData));
  }
  if (!localStorage.getItem('fitgrid_payments')) {
    localStorage.setItem('fitgrid_payments', JSON.stringify(initialPayments));
  }
};

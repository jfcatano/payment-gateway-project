import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/global/Layout';
import ProductCatalogPage from '@/features/product/pages/ProductCatalogPage';
import MyTransactionsPage from '@/features/product/pages/MyTransactions';
import ErrorPage from '@/pages/errorPage';
import PaymentSuccessPage from '@/features/product/pages/PaymentSuccessPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ProductCatalogPage />,
        // We can use errorElement to asign a custom error page for ProductCatalogPage.
      },
      {
        path: 'my-transactions',
        element: <MyTransactionsPage />,
      },
      {
        path: 'payment-success',
        element: <PaymentSuccessPage />,
      },
       {
         path: '*',
         element: <ErrorPage />,
       }
    ],
  },
  // Here we can have routes of superior level that not needs a Layour, such as login or register
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },
]);
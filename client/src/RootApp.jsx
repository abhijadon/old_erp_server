import { Suspense, lazy } from 'react';
import { HashRouter as Router } from 'react-router-dom'; // Updated import for HashRouter
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

import '@/style/app.css'; // Updated import statement for app.css
import '@/style/index.css'; // Updated import statement for index.css

const ERP_SODEOs = lazy(() => import('./apps/IdurarOs'));

export default function RoutApp() {
  return (
    <Router>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <ERP_SODEOs />
        </Suspense>
      </Provider>
    </Router>
  );
}
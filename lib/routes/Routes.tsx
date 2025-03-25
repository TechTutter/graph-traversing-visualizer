import { MainLayout } from '@lib/layouts/MainLayout';
import { Loader } from '@lib/ui/Loader';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Paths } from './Paths';

const HomePage = lazy(() => import('@/pages/HomePage'));

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={Paths.HomePage} element={<HomePage />} />
        <Route path={Paths.Empty} element={<Navigate to={Paths.HomePage} />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;

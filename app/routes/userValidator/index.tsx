import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import WrappedValidator from './WrappedValidator';

const ValidatorRoute = () => (
  <Routes>
    <Route index element={<WrappedValidator />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default ValidatorRoute;

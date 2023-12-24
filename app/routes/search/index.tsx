import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import SearchPageWrapper from './SearchPageWrapper';

const SearchRoute = () => (
  <Routes>
    <Route index element={<SearchPageWrapper />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default SearchRoute;

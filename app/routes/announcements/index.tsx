import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import AnnouncementsList from './components/AnnouncementsList';

const AnnouncementsRoute = () => (
  <Routes>
    <Route index element={<AnnouncementsList />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AnnouncementsRoute;

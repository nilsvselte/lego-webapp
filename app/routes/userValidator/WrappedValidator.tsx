import { debounce } from 'lodash';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';
import { autocomplete } from 'app/actions/SearchActions';
import { fetchUser } from 'app/actions/UserActions';
import { Content } from 'app/components/Content';
import Validator from 'app/components/UserValidator';
import { useAppDispatch } from 'app/store/hooks';
import type { UserSearchResult } from 'app/reducers/search';
import type { SearchUser } from 'app/store/models/User';

const searchTypes = ['users.user'];

const WrappedValidator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const clearSearch = () =>
    navigate(`/validator?${qs.stringify({ ...search, q: '' })}`);

  const handleSelect = async (
    result: UserSearchResult
  ): Promise<SearchUser> => {
    const fetchRes = await dispatch(
      fetchUser(result.username, { propagateError: false })
    );

    return Object.values(fetchRes.payload?.entities?.users)[0] as SearchUser;
  };

  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const onQueryChanged = debounce((query) => {
    navigate(`/validator?${qs.stringify({ ...search, q: query })}`);

    if (query) {
      dispatch(autocomplete(query, searchTypes));
    }
  }, 300);

  return (
    <Content>
      <Validator
        clearSearch={clearSearch}
        handleSelect={handleSelect}
        onQueryChanged={onQueryChanged}
        validateAbakusGroup
      />
    </Content>
  );
};

export default WrappedValidator;

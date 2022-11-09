import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { autocomplete } from 'app/actions/SearchActions';
import { Content } from 'app/components/Content';
import Validator from 'app/components/UserValidator';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const searchTypes = ['users.user'];

const loadData = async (props, dispatch): any => {
  const query = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).q;

  if (query && typeof query === 'string') {
    await dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const results = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).q
    ? selectAutocomplete(state)
    : [];
  return {
    location: props.location,
    searching: state.search.searching,
    results,
  };
};

const mapDispatchToProps = (dispatch, { eventId }) => {
  const url = `/validator?q=`;
  return {
    clearSearch: () => dispatch(push(url)),
    handleSelect: () => Promise.resolve(),
    onQueryChanged: debounce((query) => {
      dispatch(push(url + query));

      if (query) {
        dispatch(autocomplete(query, searchTypes));
      }
    }, 300),
  };
};

const WrappedValidator = (props) => (
  <Content>
    <Validator {...props} />
  </Content>
);

export default compose(
  withPreparedDispatch('fetchValidator', loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(WrappedValidator);

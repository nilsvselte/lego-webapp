import callAPI from 'app/actions/callAPI';
import { emailListSchema } from 'app/reducers';
import { EmailList } from './ActionTypes';
import type { EmailListEntity } from 'app/reducers/emailLists';
import type { ID } from 'app/store/models';

export function fetchEmailList(emailListId: ID) {
  return callAPI({
    types: EmailList.FETCH,
    endpoint: `/email-lists/${emailListId}/`,
    schema: emailListSchema,
    meta: {
      errorMessage: 'Henting av e-postliste feilet',
    },
    propagateError: true,
  });
}

export function createEmailList(emailList: EmailListEntity) {
  return callAPI({
    types: EmailList.CREATE,
    endpoint: '/email-lists/',
    method: 'POST',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Opprettelse av e-postlisten feilet',
    },
  });
}

export function editEmailList(emailList: EmailListEntity) {
  return callAPI({
    types: EmailList.EDIT,
    endpoint: `/email-lists/${emailList.id}/`,
    method: 'PUT',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Endring av e-postliste feilet',
    },
  });
}

export function fetch({
  next,
  query,
}: {
  next?: boolean;
  query?: Record<string, string | number>;
} = {}) {
  return callAPI({
    types: EmailList.FETCH,
    endpoint: '/email-lists/',
    pagination: {
      fetchNext: !!next,
    },
    query,
    schema: [emailListSchema],
    meta: {
      errorMessage: 'Henting av e-postlister feilet',
    },
    propagateError: true,
  });
}

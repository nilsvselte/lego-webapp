import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  fetch,
  fetchEventsForCompany,
  fetchJoblistingsForCompany,
} from 'app/actions/CompanyActions';
import { getEndpoint } from 'app/actions/EventActions';
import CollapsibleDisplayContent from 'app/components/CollapsibleDisplayContent';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import EventListCompact from 'app/components/EventListCompact';
import JoblistingItem from 'app/components/JoblistingItem';
import NavigationTab from 'app/components/NavigationTab';
import TextWithIcon from 'app/components/TextWithIcon';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from 'app/reducers/companies';
import { selectPagination } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createQueryString from 'app/utils/createQueryString';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './Company.css';
import type { ID } from 'app/store/models';

const queryString = (companyId: ID) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const CompanyDetail = () => {
  const [viewOldEvents, setViewOldEvents] = useState(false);

  const { companyId, loading } = useParams<{
    companyId: string;
    loading: string;
  }>();
  const showFetchMoreEvents = useAppSelector((state) =>
    selectPagination('events', {
      queryString: queryString(companyId),
    })(state)
  );
  const company = useAppSelector((state) =>
    selectCompanyById(state, { companyId })
  );
  const companyEvents = useAppSelector((state) =>
    selectEventsForCompany(state, { companyId })
  );
  const joblistings = useAppSelector((state) =>
    selectJoblistingsForCompany(state, { companyId })
  );
  const pagination = useAppSelector((state) => state.events.pagination);
  const endpoint = getEndpoint(pagination, queryString(companyId));

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailedCompany',
    () =>
      companyId &&
      Promise.all([
        dispatch(fetch(companyId)),
        dispatch(
          fetchEventsForCompany({
            endpoint: `/events/${queryString(companyId)}`,
            queryString: queryString(companyId),
          })
        ),
        dispatch(fetchJoblistingsForCompany(companyId)),
      ]),
    [companyId]
  );

  if (!company) {
    return <LoadingIndicator loading={Boolean(loading)} />;
  }

  const fetchMoreEvents = () =>
    dispatch(
      fetchEventsForCompany({
        endpoint,
        queryString: queryString(companyId),
      })
    );

  const sortedEvents = companyEvents.sort(
    (a, b) => moment(b.startTime).unix() - moment(a.startTime).unix()
  );
  const upcomingEvents = sortedEvents.filter((event) =>
    moment().isBefore(moment(event.startTime))
  );
  const oldEvents = sortedEvents.filter((event) =>
    moment().isAfter(moment(event.startTime))
  );

  const companyInfo = [
    {
      text: company.website,
      icon: 'globe-outline',
      link: true,
    },
    {
      text: company.address,
      icon: 'location-outline',
      link: false,
    },
    {
      text: company.phone,
      icon: 'call-outline',
      link: false,
    },
    {
      text: company.companyType,
      icon: 'briefcase-outline',
      link: false,
    },
  ];

  return (
    <Content
      banner={company?.logo}
      bannerPlaceholder={company?.logoPlaceholder}
    >
      <Helmet title={company.name} />
      <NavigationTab
        title={company.name}
        back={{
          label: 'Bedriftsoversikt',
          path: '/companies',
        }}
      />

      <ContentSection>
        <ContentMain>
          <CollapsibleDisplayContent content={company.description} />
          <h3 className={styles.sectionHeader}>Kommende arrangementer</h3>
          <EventListCompact
            events={upcomingEvents}
            noEventsMessage="Ingen kommende arrangementer"
            eventStyle="extra-compact"
          />

          {oldEvents.length > 0 && (
            <Button onClick={() => setViewOldEvents(!viewOldEvents)}>
              {viewOldEvents
                ? 'Skjul tidligere arrangementer'
                : 'Vis tidligere arrangementer'}
            </Button>
          )}
          {viewOldEvents && (
            <>
              <h3 className={styles.sectionHeader}>Tidligere arrangementer</h3>
              <EventListCompact
                events={oldEvents}
                noEventsMessage="Ingen tidligere arrangementer"
                eventStyle="extra-compact"
              />
            </>
          )}
          {viewOldEvents && showFetchMoreEvents && (
            <Flex justifyContent="center">
              <Icon
                name="chevron-down-circle-outline"
                size={40}
                onClick={fetchMoreEvents}
                style={{ cursor: 'pointer' }}
              />
            </Flex>
          )}

          <h3 className={styles.sectionHeader}>Jobbannonser</h3>
          {joblistings.length > 0 ? (
            joblistings.map((joblisting) => (
              <JoblistingItem key={joblisting.id} joblisting={joblisting} />
            ))
          ) : (
            <span className="secondaryFontColor">
              Ingen tilgjengelige jobbannonser
            </span>
          )}
        </ContentMain>
        {companyInfo.some((info) => info.text) && (
          <ContentSidebar>
            {companyInfo.map(
              (info) =>
                info.text && (
                  <TextWithIcon
                    key={info.text}
                    iconName={info.icon}
                    content={
                      info.link ? (
                        <a href={info.text}>{company.name}</a>
                      ) : (
                        info.text
                      )
                    }
                  />
                )
            )}
          </ContentSidebar>
        )}
      </ContentSection>
    </Content>
  );
};

export default guardLogin(CompanyDetail);

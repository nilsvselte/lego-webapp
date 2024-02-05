import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import config from 'app/config';
import styles from './AddToCalender.css';
import type { Meeting } from 'app/models';

type Props = {
  icalToken: string;
  meeting: Meeting;
};

type calendarOptionAttributes = {
  name: string;
  link: string;
  type: string;
  bold?: boolean;
};
const calendarTypes: string[] = ['Google Calendar', 'iCalendar'];
//Copied from EventFooter.tsx
const getIcalUrl = (icalToken, icalType) =>
  `${config.serverUrl}/calendar-ical/${icalType}/?token=${icalToken}`;

const getIcalUrlGoogle = (icalToken, icalType) => {
  const icalUrl = getIcalUrl(icalToken, icalType).replace(/^https/i, 'http');
  return `https://www.google.com/calendar/render?cid=${icalUrl}`;
};

const optionArray: calendarOptionAttributes[] = [
  {
    name: 'Legg til kun dette eventet',
    link: 'default',
    bold: true,
    type: 'single_meeting',
  },
  {
    name: 'Synkroniser alle møter OG favoritt arrangementer',
    link: 'default',
    type: 'personal',
  },
];

const createGoogleCalenderLink = (meeting) => {
  const baseURL = 'https://calendar.google.com/calendar/event';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${formatTimeForGoogle(meeting.startTime)}/${formatTimeForGoogle(
      meeting.endTime
    )}`,
    text: meeting.title,
    details: meeting.description,
    location: meeting.location,
    sf: 'true',
    output: 'xml',
  });
  return `${baseURL}?${params.toString()}`;
};
const formatTimeForGoogle = (dateTime: string) => {
  return dateTime.replace(/-|:/g, '');
};

const AddToCalenderToggle = ({ icalToken, meeting }: Props) => {
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [googleCalendar, setGoogleCalandar] = useState(false);
  return (
    <div>
      <Button
        className={styles.calendarButton}
        onClick={() => setCalendarIsOpen(!calendarIsOpen)}
      >
        {!calendarIsOpen ? 'Vis kalender 📅' : 'Skjul kalender ♻️'}
      </Button>

      {calendarIsOpen && (
        <>
          <br />
          <Button
            className={`${styles.leftCalendarTypeButton} ${
              styles.calendarButton
            } ${googleCalendar ? styles.selected : ''}`}
            onClick={() => setGoogleCalandar(true)}
          >
            GoogleCalendar
          </Button>
          {/* Style is used to overwrite current <Button/> implementation */}
          <Button
            className={`${styles.rightCalendarTypeButton} ${
              styles.calendarButton
            } ${!googleCalendar ? styles.selected : ''}`}
            style={{ marginLeft: 0 }}
            onClick={() => setGoogleCalandar(false)}
          >
            iCalendar
          </Button>

          <ul>
            {calendarTypes.map((type) =>
              (googleCalendar && type == 'Google Calendar') ||
              (!googleCalendar && type == 'iCalendar') ? (
                <li key={type}>
                  {optionArray.map((option) => (
                    <li key={option.name}>
                      <a
                        href={
                          option.type !== 'single_meeting'
                            ? type !== 'iCalendar'
                              ? getIcalUrlGoogle(icalToken, option.type)
                              : getIcalUrl(icalToken, option.type)
                            : createGoogleCalenderLink(meeting)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          styles.calendarLink +
                          (option.bold ? ' ' + styles.bold : '')
                        }
                      >
                        {option.name}
                      </a>
                    </li>
                  ))}
                </li>
              ) : null
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default AddToCalenderToggle;

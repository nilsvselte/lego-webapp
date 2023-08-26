import { Button, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import styles from './AnnouncementsList.css';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type { DetailedAnnouncement } from 'app/store/models/Announcement';

type Props = {
  announcement: DetailedAnnouncement;
  sendAnnouncement: (id: ID) => Promise<unknown>;
  deleteAnnouncement: (id: ID) => Promise<unknown>;
  actionGrant: ActionGrant;
};

const AnnouncementItem = ({
  announcement,
  sendAnnouncement,
  deleteAnnouncement,
  actionGrant,
}: Props) => {
  return (
    <Flex className={styles.item}>
      <Flex column>
        <Flex className={styles.date}>
          {announcement.sent ? (
            <Time time={announcement.sent} format="ll HH:mm" />
          ) : (
            'Ikke sendt'
          )}
        </Flex>
        <Flex className={styles.msg}>{announcement.message}</Flex>
        {announcement.fromGroup && (
          <Flex wrap>
            {'Sendt fra: '}
            <Link
              className={styles.recipients}
              to={`/admin/groups/${announcement.fromGroup.id}/`}
            >
              {announcement.fromGroup.name}
            </Link>
          </Flex>
        )}
        <Flex column>
          <span className={styles.recHeader}>Mottakere:</span>
          <Flex wrap>
            {announcement.events.length > 0 && 'Arrangementer: '}
            {announcement.events.map((event, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/events/${event.slug}/`}
              >
                {event.title}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.meetings.length > 0 && 'Møter: '}
            {announcement.meetings.map((meeting, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/meetings/${meeting.id}/`}
              >
                {meeting.title}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.groups.length > 0 && 'Grupper: '}
            {announcement.groups.map((group, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/admin/groups/${group.id}/`}
              >
                {group.name}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.users.length > 0 && 'Brukere: '}
            {announcement.users.map((user, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/users/${user.username}/`}
              >
                {user.fullName}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Flex>
      {!announcement.sent &&
        actionGrant.includes('send') &&
        actionGrant.includes('delete') && (
          <Flex className={styles.wrapperSendButton}>
            <Button danger onClick={() => deleteAnnouncement(announcement.id)}>
              Slett
            </Button>
            <Button secondary onClick={() => sendAnnouncement(announcement.id)}>
              Send
            </Button>
          </Flex>
        )}
    </Flex>
  );
};

export default AnnouncementItem;

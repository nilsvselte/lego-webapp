import { Card, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { map, toPairs } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { fetch } from 'app/actions/TagActions';
import { Content } from 'app/components/Content';
import { selectTagById } from 'app/reducers/tags';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './TagDetail.css';

const translate = (key: string) => {
  const trans = {
    article: 'Artikler',
    event: 'Arrangementer',
    quote: 'Sitater',
    joblisting: 'Jobbannonser',
    poll: 'Avstemninger',
  };
  return trans[key];
};

const link = (key: string, tag: string) => {
  const links = {
    article: (
      <Link to={`/articles?tag=${tag}`}>
        <h4>{translate(key)}</h4>
      </Link>
    ),
  };
  return links[key] || <h4>{translate(key)}</h4>;
};

const TagDetail = () => {
  const { tagId } = useParams();
  const tag = useAppSelector((state) => selectTagById(state, { tagId }));

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchTagDetail', () => tagId && dispatch(fetch(tagId)), [
    tagId,
  ]);

  return (
    <Content>
      <Helmet title={tag.tag} />
      <h1>{tag.tag}</h1>

      <Flex wrap>
        {map(toPairs(tag.relatedCounts), (pair) => (
          <Card className={styles.entity}>
            <h2>{pair[1]}</h2>
            {link(pair[0], tag.tag)}
          </Card>
        ))}
      </Flex>
    </Content>
  );
};

export default TagDetail;

import { createRoot } from 'react-dom/client';
import { useState, useCallback, useMemo, Fragment } from 'react';

const WIKI_HOST = 'https://en.wikipedia.org/wiki/';

const fetchData = searchTerm => {
  const urlSearch =
    'https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=' + searchTerm;

  return fetch(urlSearch, { mode: 'cors' }).then(response => response.json());
};

/*
 As an user, I should be able:
 - to search Wikipedia links with a search term
 - to keep a distinct history list of my last five search terms + the time when the last search happened
**/
const WikepediaLinksView = () => {
  const [history, setHistory] = useState({});
  const [searchTerm, setSearchTerms] = useState('');
  const [fetchedAt, setFetchedAt] = useState(new Date());
  const [links, setLinks] = useState([]);

  const handleSubmit = useCallback(
    async query => {
      const response = await fetchData(query);

      const date = new Date();

      setFetchedAt(date);
      setLinks(response[1]);

      const nextHistory = {
        ...history,
        [query]: date.getTime(),
      };

      setHistory(nextHistory);
    },
    [setFetchedAt, setLinks, history, setHistory]
  );

  const handleHistoryClick = useCallback(
    historySearch => {
      setSearchTerms(historySearch);
      handleSubmit(historySearch);
    },
    [setSearchTerms, handleSubmit]
  );

  const historyList = useMemo(() => {
    const kv = Object.entries(history);

    kv.sort((a, b) => b[1] - a[1]);
    return kv.slice(0, 5);
  }, [history]);

  return (
    <div className="container">
      <div className="columns">
        <input
          type="text"
          placeholder="You Know, for Search…"
          value={searchTerm}
          onChange={e => {
            setSearchTerms(e.target.value);
          }}
        />
        <button onClick={() => handleSubmit(searchTerm)}>Search</button>
      </div>
      <div>
        <ul>
          {historyList.map(([query, date]) => (
            <li key={query} onClick={() => handleHistoryClick(query)}>
              {query} - {date}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <dl>
          <dt>Your Wikipedia links (fetched at {fetchedAt.toISOString()}):</dt>
          <dd>
            {links.map(l => (
              <Fragment key={l}>
                <a href={`${WIKI_HOST}${l}`} target="_blank" rel="noreferrer">
                  {l}
                </a>{' '}
                <br />
              </Fragment>
            ))}
          </dd>
          <dt>Previous search term:</dt>
          <dd />
        </dl>
      </div>
    </div>
  );
};

const container = document.querySelector('#root');
const root = createRoot(container);

root.render(<WikepediaLinksView />);

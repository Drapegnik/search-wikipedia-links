import { createRoot } from 'react-dom/client';
import { useState } from 'react';

const WIKI_HOST = 'https://en.wikipedia.org';
const HISTORY_SIZE = 5;

const fetchData = query => {
  const url = `${WIKI_HOST}/w/api.php?origin=*&action=opensearch&search=${query}`;

  return fetch(url, { mode: 'cors' }).then(response => response.json());
};

/*
 As an user, I should be able:
 - to search Wikipedia links with a search term
 - to keep a distinct history list of my last five search terms + the time when the last search happened
**/
const WikepediaLinksView = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerms] = useState('');
  const [fetchedAt, setFetchedAt] = useState(new Date());
  const [links, setLinks] = useState([]);

  const handleQuerySubmit = async query => {
    const linksData = await fetchData(query);
    const fetchedAtDate = new Date();
    const historyMap = Object.fromEntries(history);

    historyMap[query] = fetchedAtDate.getTime();

    let nextHistory = Object.entries(historyMap);

    // sort history by date (timestamp)
    nextHistory.sort((a, b) => b[1] - a[1]);
    nextHistory = nextHistory.slice(0, HISTORY_SIZE);

    setFetchedAt(fetchedAtDate);
    setLinks(linksData[1]);
    setHistory(nextHistory);
    setSearchTerms('');
  };

  return (
    <div className="container">
      <form
        className="columns"
        onSubmit={e => {
          e.preventDefault();
          handleQuerySubmit(searchTerm);
        }}
      >
        <input
          type="search"
          placeholder="You Know, for Search…"
          value={searchTerm}
          onChange={e => {
            setSearchTerms(e.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <dl>
          {!!history.length && (
            <>
              <dt>Previous search term:</dt>
              <dd>
                <ol>
                  {history.map(([query, date]) => (
                    <li key={query}>
                      <span>{`${query} (fetched at: ${new Date(
                        date
                      ).toLocaleTimeString()}) `}</span>
                      <button
                        onClick={() => {
                          setSearchTerms(query);
                          handleQuerySubmit(query);
                        }}
                      >
                        show
                      </button>
                    </li>
                  ))}
                </ol>
              </dd>
            </>
          )}
          {!!links.length && (
            <>
              <dt>Your Wikipedia links (fetched at {fetchedAt.toLocaleString()}):</dt>
              <dd>
                {links.map(name => (
                  <p key={name}>
                    <a href={`${WIKI_HOST}/wiki/${name}`} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  </p>
                ))}
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

const container = document.querySelector('#root');
const root = createRoot(container);

root.render(<WikepediaLinksView />);

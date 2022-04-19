import { createRoot } from 'react-dom/client';
import { useState } from 'react';

/* 
 As an user, I should be able:
 - to search Wikipedia links with a search term
 - to keep a distinct history list of my last five search terms + the time when the last search happened
**/
const WikepediaLinksView = () => {
  const [searchTerm, setSearchTerms] = useState("");
  const [fetchedAt, setFetchedAt] = useState(new Date());
  const [links, setLinks] = useState([]);

  const fetchData = () => {
    const urlSearch =
      "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=" +
      searchTerm;
    fetch(urlSearch, { mode: "cors" })
      .then((response) => response.json())
      .then((response) => {
        setFetchedAt(new Date());
        setLinks(response[1]);
      });
  };

  return (
    <div className="container">
      <div className="columns">
        <input
          type="text"
          placeholder="You Know, for Search…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerms(e.target.value);
          }}
        />
        <button onClick={() => fetchData()}>Search</button>
      </div>
      <div>
        <dl>
          <dt>Your Wikipedia links (fetched at {fetchedAt.toISOString()}):</dt>
          <dd>
            {links.map((l) => (
              <>
                {l} <br />
              </>
            ))}
          </dd>
          <dt>Previous search term:</dt>
          <dd></dd>
        </dl>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<WikepediaLinksView />);
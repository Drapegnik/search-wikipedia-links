# search-wikipedia-links

## task

As an user, I should be able to:

- search Wikipedia links with a search term
- re-run my search at any time
- keep a distinct history list of my last five search terms + the time when the last search happened

![](https://codesignal.s3.amazonaws.com/uploads/1639800404400/Screen_Shot_2021-12-17_at_8.06.25_PM.png)

## initial code

```jsx
// Import State hook
const { useState } = React;

/*
As an user, I should be able:
  # to search Wikipedia links with a search term
  # to keep a distinct history list of my last five search terms + the time when the last search happened
**/

const WikepediaLinksView = () => {
  const [searchTerm, setSearchTerms] = useState('');
  const [fetchedAt, setFetchedAt] = useState(new Date());
  const [links, setLinks] = useState([]);

  const fetchData = () => {
    const urlSearch =
      'https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=' + searchTerm;
    fetch(urlSearch, { mode: 'cors' })
      .then(response => response.json())
      .then(response => {
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
          onChange={e => {
            setSearchTerms(e.target.value);
          }}
        />
        <button onClick={() => fetchData()}>Search</button>
      </div>
      <div>
        <dl>
          <dt>Your Wikipedia links (fetched at {fetchedAt.toISOString()}):</dt>
          <dd>
            {links.map(l => (
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

// Render React element into the DOM
const rootElement = document.getElementById('root');
ReactDOM.render(<WikepediaLinksView />, rootElement);
```

## demo

[![](https://res.cloudinary.com/dzsjwgjii/image/upload/v1650409253/wikilinks.png)](https://search-wikipedia-links.vercel.app/)

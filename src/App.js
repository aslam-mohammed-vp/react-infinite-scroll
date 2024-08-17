import logo from './logo.svg';
import './App.css';
import { useCallback, useRef, useState } from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const observer = useRef();

  const { books, error, hasMore, loading } = useBookSearch(query, pageNumber);


  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('visible');
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    }, [loading, hasMore]);

    if (node) observer.current.observe(node);
    console.log(node);
  })

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type='text' value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        if (index === books.length - 1)
          return (<div ref={lastBookElementRef} key={book}>{book}</div>);
        return (<div key={book}>{book}</div>);

      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}

export default App;

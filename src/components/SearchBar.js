import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <Form inline onSubmit={handleSearch}>
      <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="outline-success">Search</Button>
    </Form>
  );
};

export default SearchBar;

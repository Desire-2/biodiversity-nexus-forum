import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const TagsCategories = ({ onChange }) => {
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');

  const handleTagChange = (e) => {
    setTags(e.target.value.split(','));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ tags, category });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <Form.Control type="text" placeholder="Enter tags separated by commas" onChange={handleTagChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" placeholder="Enter category" onChange={handleCategoryChange} />
      </Form.Group>
      <Button type="submit">Save</Button>
    </Form>
  );
};

export default TagsCategories;

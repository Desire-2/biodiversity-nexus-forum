import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    profilePicture: user.profilePicture || '',
    bio: user.bio || '',
    socialLinks: user.socialLinks || {},
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/profile', profileData);
      // Handle success response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Container>
      <h1>Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="text"
            name="profilePicture"
            value={profileData.profilePicture}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            type="text"
            name="twitter"
            value={profileData.socialLinks.twitter || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Facebook</Form.Label>
          <Form.Control
            type="text"
            name="facebook"
            value={profileData.socialLinks.facebook || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>LinkedIn</Form.Label>
          <Form.Control
            type="text"
            name="linkedin"
            value={profileData.socialLinks.linkedin || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Save</Button>
      </Form>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const response = await axios.get(`/api/user/${userId}`);
  return {
    props: { user: response.data },
  };
}

export default Profile;

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './PasswordValidation.css';

const PasswordValidation = ({ show, onClose, onSuccess, profileId }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profileId}/validate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the password in localStorage for future use
        localStorage.setItem(`profile_${profileId}_password`, password);
        onSuccess();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to validate password');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enter Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter profile password"
              required
            />
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Validate
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordValidation; 
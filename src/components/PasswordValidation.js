import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useData } from '../context/dataContext';
import './PasswordValidation.css';

const PasswordValidation = ({ show, onClose, onSuccess, profileId }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { validatePassword } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const isValid = await validatePassword(profileId, password);

      if (isValid) {
        localStorage.setItem(`profile_${profileId}_password`, password);
        onSuccess();
      } else {
        onClose();
        setError('Invalid password');
      }
    } catch (err) {
      onClose();
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
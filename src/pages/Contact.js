import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import './PageStyles.css';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    emailjs.send(
      "service_fo67wbb",
      "template_qmkburn",
      {
        subject: formData.subject,
        name: formData.name,
        message: formData.message,
        email: formData.email,
      },
      "8mUwwkAW2jjH0tg6N"
    )
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      })
      .catch((error) => {
        console.error('Error sending email:', error.text);
        setIsSubmitting(false);
        setSubmitStatus('error');
      });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Me</h1>
      <div className="page-content">
        <Container>
          <Row className="mb-5">
            <Col md={12}>
              <p className="text-center lead">
                I'd love to hear from you! Whether you have a question about my work, 
                want to discuss a project, or just want to say hello, feel free to reach out.
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col lg={5} className="mb-4 mb-lg-0">
              <Card className="contact-info-card h-100">
                <Card.Body>
                  <h3 className="mb-4">Get In Touch</h3>
                  
                  <div className="contact-info-item mb-4">
                    <FaEnvelope className="contact-icon" />
                    <div>
                      <h5>Email</h5>
                      <p><a href="mailto:marotiuppe891@gmail.com">marotiuppe891@gmail.com</a></p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item mb-4">
                    <FaPhone className="contact-icon" />
                    <div>
                      <h5>Phone</h5>
                      <p><a href="tel:+919867205329">+91 9867205329</a></p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item mb-4">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div>
                      <h5>Location</h5>
                      <p>Hyderabad, Telangana, India</p>
                    </div>
                  </div>
                  
                  <div className="social-links mt-4">
                    <h5 className="mb-3">Connect With Me</h5>
                    <div className="d-flex">
                      <a href="https://www.linkedin.com/in/maroti-u-448324199/" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaLinkedin />
                      </a>
                      <a href="https://github.com/marotiuppe" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaGithub />
                      </a>
                      <a href="https://www.instagram.com/maroti_uppe/" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaInstagram />
                      </a>
                      <a href="https://www.facebook.com/maroti.uppe" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaFacebook />
                      </a>
                      <a href="https://wa.me/message/55WZCOBNHZHNN1" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={7}>
              <Card className="contact-form-card h-100">
                <Card.Body>
                  <h3 className="mb-4">Send Me a Message</h3>
                  
                  {submitStatus === 'success' && (
                    <div className="alert alert-success" role="alert">
                      Thank you for your message! I'll get back to you as soon as possible.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="alert alert-danger" role="alert">
                      There was an error sending your message. Please try again later.
                    </div>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can I help you?"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Your message here..."
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Contact; 
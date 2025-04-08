import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './VisitStats.css';

const VisitStats = () => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // Get the current profile ID from the URL
    const profileId = window.location.pathname.split('/')[1];
    
    // Get existing visit count from localStorage
    const storedCount = localStorage.getItem(`visitCount_${profileId}`);
    const count = storedCount ? parseInt(storedCount) : 0;
    
    // Get the last visit timestamp
    const lastVisitTime = localStorage.getItem(`lastVisitTime_${profileId}`);
    const currentTime = new Date().getTime();
    
    // Only increment if this is a new visit (more than 1 second since last visit)
    if (!lastVisitTime || (currentTime - parseInt(lastVisitTime)) > 1000) {
      // Increment the count
      const newCount = count + 1;
      
      // Store the updated count and timestamp
      localStorage.setItem(`visitCount_${profileId}`, newCount.toString());
      localStorage.setItem(`lastVisitTime_${profileId}`, currentTime.toString());
      
      // Update the state
      setVisitCount(newCount);
    } else {
      // If it's a duplicate visit within 1 second, just display the current count
      setVisitCount(count);
    }
  }, []);

  return (
    <Card className="visit-stats-card">
      <Card.Body>
        <Row>
          <Col>
            <h5 className="stats-title">Site Visits</h5>
            <div className="stats-value">{visitCount}</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VisitStats; 
// src/pages/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  // On initialise isLogin à false pour afficher le formulaire d'inscription par défaut
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const airtableApiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
      const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
      
      if (isLogin) {
        // Login Logic
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/Users?filterByFormula=AND({email}='${formData.email}',{password}='${formData.password}')`, {
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
          },
        });
        
        const data = await response.json();
        
        if (data.records.length > 0) {
          localStorage.setItem('user', JSON.stringify(data.records[0].fields));
          navigate('/dashboard');
        } else {
          alert('Invalid credentials');
        }
      } else {
        // Sign Up Logic
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/Users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [{
              fields: {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: 'user',
                createdAt: new Date().toISOString()
              }
            }]
          })
        });
        
        const data = await response.json();
        
        if (data.records) {
          localStorage.setItem('user', JSON.stringify(data.records[0].fields));
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    // Réinitialiser le formulaire lors du changement
    setFormData({
      fullName: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form-container">
          <h2>{isLogin ? 'LOG IN' : 'SIGN UP'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                placeholder="E-mail"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button type="submit" className="submit-button">
              {isLogin ? 'LOG IN' : 'SIGN UP'}
            </button>
          </form>
        </div>
        
        <div className="auth-info">
          <h3>{isLogin ? "Don't have an account?" : 'Have an account?'}</h3>
          <p>Personalise Twitter based on where you've seen Twitter content on the web.</p>
          <button 
            className="login-button"
            onClick={toggleAuth}>
            {isLogin ? 'SIGN UP' : 'LOG IN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
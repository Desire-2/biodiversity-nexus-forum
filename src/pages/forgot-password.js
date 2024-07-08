import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setError(error.response.data.error);
    } finally
      {
        setIsLoading(false);
      }
  };

  return (
    <div>
      <Header />
      <div className={`container ${styles.container}`}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={`card ${styles.card}`}>
              <div className={`card-body ${styles.cardBody}`}>
                <h1 className={styles.heading}>Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                  <div className={styles.inputField}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  {message && <p className={styles.infoMessage}>{message}</p>}
                  {error && <p className={styles.errorMessage}>{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

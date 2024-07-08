import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password, confirmPassword });
      setMessage(response.data.message);
      setPassword('');
      setConfirmPassword('');
      router.push('/login'); // Redirect to login page
    } catch (error) {
      setError(error.response.data.error);
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
                <h1 className={styles.heading}>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                  <div className={styles.inputField}>
                    <label htmlFor="password" className={styles.formLabel}>New Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className={`btn btn-primary ${styles.submitButton}`}>
                    Reset Password
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

export default ResetPassword;

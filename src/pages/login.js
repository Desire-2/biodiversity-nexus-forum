import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Login.module.css';
import { useRouter } from 'next/router';

const Login = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/auth/login', values);
      setMessage('Login successful! Redirecting to dashboard...');
      resetForm();
      router.push('/dashboard');
    } catch (error) {
      setMessage(error.response.data.error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Header />
      <div className={`container ${styles.container}`}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={`card ${styles.card}`}>
              <div className={`card-body ${styles.cardBody}`}>
                <h1 className={styles.heading}>Login</h1>
                <Formik
                  initialValues={{ email: '', password: '', rememberMe: false }}
                  validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Required'),
                    password: Yup.string().required('Required'),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className={styles.inputField}>
                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <Field name="email" type="email" className="form-control" />
                        <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.inputField}>
                        <label htmlFor="password" className={styles.formLabel}>Password</label>
                        <Field name="password" type="password" className="form-control" />
                        <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.inputField}>
                        <Field type="checkbox" name="rememberMe" />
                        <label htmlFor="rememberMe" className={styles.rememberMeLabel}>Remember Me</label>
                      </div>
                      <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </button>
                      {message && <p className={styles.infoMessage}>{message}</p>}
                      <div className={styles.resetPasswordLink}>
                        <a href="/forgot-password">Forgot Password?</a>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

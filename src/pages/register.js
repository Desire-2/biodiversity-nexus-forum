import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Register.module.css';

const Register = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/auth/register', values);
      setMessage('Registration successful! You can now log in.');
      resetForm();
      router.push('/login'); // Redirect to login page
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
                <h1 className={styles.heading}>Register</h1>
                <Formik
                  initialValues={{ username: '', email: '', password: '', confirmPassword: '', name: '' }}
                  validationSchema={Yup.object({
                    username: Yup.string().required('Required'),
                    email: Yup.string().email('Invalid email address').required('Required'),
                    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
                    confirmPassword: Yup.string()
                      .oneOf([Yup.ref('password'), null], 'Passwords must match')
                      .required('Required'),
                    name: Yup.string().required('Required'),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className={styles.inputField}>
                        <label htmlFor="username" className={styles.formLabel}>Username</label>
                        <Field name="username" type="text" className="form-control" />
                        <ErrorMessage name="username" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.inputField}>
                        <label htmlFor="name" className={styles.formLabel}>Name</label>
                        <Field name="name" type="text" className="form-control" />
                        <ErrorMessage name="name" component="div" className={styles.errorMessage} />
                      </div>
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
                        <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                        <Field name="confirmPassword" type="password" className="form-control" />
                        <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage} />
                      </div>
                      <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </button>
                      {message && <p className={styles.infoMessage}>{message}</p>}
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

export default Register;

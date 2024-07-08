import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/auth/reset-password', values);
      setMessage('Password reset successful! You can now log in with your new password.');
      resetForm();
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
                <h1 className={styles.heading}>Reset Password</h1>
                <Formik
                  initialValues={{ email: '', newPassword: '', confirmNewPassword: '' }}
                  validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Required'),
                    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
                    confirmNewPassword: Yup.string()
                      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                      .required('Required'),
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
                        <label htmlFor="newPassword" className={styles.formLabel}>New Password</label>
                        <Field name="newPassword" type="password" className="form-control" />
                        <ErrorMessage name="newPassword" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.inputField}>
                        <label htmlFor="confirmNewPassword" className={styles.formLabel}>Confirm New Password</label>
                        <Field name="confirmNewPassword" type="password" className="form-control" />
                        <ErrorMessage name="confirmNewPassword" component="div" className={styles.errorMessage} />
                      </div>
                      <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;

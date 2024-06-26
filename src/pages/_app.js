import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import ThemeProvider, { ThemeContext } from '../../contexts/ThemeContext'; // Corrected import
import '../styles/globals.css';

// Create a wrapper component for applying theme
function ThemeWrapper({ children }) {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <Component {...pageProps} />
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default MyApp;
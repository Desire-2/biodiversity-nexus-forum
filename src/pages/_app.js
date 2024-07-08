import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import 'animate.css';
import ThemeProvider, { ThemeContext } from '../../contexts/ThemeContext'; // Corrected import
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

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
    <SessionProvider session={pageProps.session}> {/* Wrap in SessionProvider */}
      <ThemeProvider>
        <ThemeWrapper>
          <Component {...pageProps} />
        </ThemeWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
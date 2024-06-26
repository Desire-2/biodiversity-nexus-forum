import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { decode as jwtDecode } from 'jwt-decode';
import { ThemeContext } from '../../contexts/ThemeContext';
import Image from 'next/image';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  const navbarStyle = {
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    background: theme === 'light' ? 'linear-gradient(45deg, #6db9ef, #7ce08a)' : 'linear-gradient(45deg, #343a40, #212529)'
  };

  const themeToggleButtonStyle = `btn ${theme === 'light' ? 'btn-dark' : 'btn-light'}`;

  return (
    <nav className={`navbar navbar-expand-lg ${theme === 'light' ? 'navbar-light' : 'navbar-dark'}`} style={navbarStyle}>
      <div className="container-fluid">
        <Link href="/" passHref>
          <div className="navbar-brand d-flex align-items-center" style={{ cursor: 'pointer' }}>
          <Image src="/logo.png" alt="Logo" className="me-2" width={40} height={40} />
            Biodiversity Nexus Forum
          </div>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded={!isNavbarCollapsed ? true : false} 
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${!isNavbarCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hello, {user.username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" passHref><div className="nav-link" style={{ cursor: 'pointer' }}>Login</div></Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" passHref><div className="nav-link" style={{ cursor: 'pointer' }}>Register</div></Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className={themeToggleButtonStyle} onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;

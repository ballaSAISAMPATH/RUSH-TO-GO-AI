import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToBottom = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      bottom: 0,
      behavior: 'smooth', 
    });
  }, [pathname]);

  return null;
};

export default ScrollToBottom;

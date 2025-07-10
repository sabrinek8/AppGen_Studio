import { useState } from 'react';

export const useNavigation = () => {
  const [activeSection, setActiveSection] = useState('generator');

  const navigateTo = (section) => {
    setActiveSection(section);
  };

  return {
    activeSection,
    navigateTo
  };
};
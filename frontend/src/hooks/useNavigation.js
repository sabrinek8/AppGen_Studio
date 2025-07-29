import { usePersistentState } from './usePersistentState';

export const useNavigation = () => {
  const [activeSection, setActiveSection] = usePersistentState('activeSection', 'generator');

  const navigateTo = (section) => {
    setActiveSection(section);
  };

  return {
    activeSection,
    navigateTo
  };
};
import React from 'react';
import { Layout, Header, Footer } from './UI';
import { ProjectContainer } from './Features/ProjectContainer';


const ReactCodePreview = () => {
  const { activeSection, navigateTo, renderActiveSection } = ProjectContainer();

  return (
    <Layout>
      <Header 
        activeSection={activeSection} 
        onNavigate={navigateTo} 
      />
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {renderActiveSection()}
      </main>
      
      <Footer />
    </Layout>
  );
};
export default ReactCodePreview;
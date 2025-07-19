import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { githubLight } from "@codesandbox/sandpack-themes";
import { Card, SectionHeader } from '../UI';
import { Columns2 } from 'lucide-react';

export const PreviewSection = ({ currentProject, selectedFile }) => (
  <Card style={{ padding: '30px' }}>
    <SectionHeader
      icon={<Columns2 size={24} />}
      title="Aperçu du projet"
      subtitle="Éditez et testez votre code en temps réel"
    />

    <div style={{
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    }}>
      <Sandpack
        template="react"
        theme={githubLight}
        files={currentProject}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 500,
          activeFile: selectedFile,
          readOnly: false
        }}
        customSetup={{
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "react-router-dom": "^6.22.0",
            "date-fns":"^4.1.0",
            "react-icons":"^5.5.0",
            "react-chartjs-2":"^5.3.0",
            "chart.js": "^4.4.0" ,
            "react-big-calendar": "^1.11.0" ,
            "recharts": "^2.8.0" 
            
          }
        }}
      />
    </div>
  </Card>
);
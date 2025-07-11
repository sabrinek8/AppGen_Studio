import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { githubLight } from "@codesandbox/sandpack-themes";
import { Card, SectionHeader } from '../UI';

export const PreviewSection = ({ currentProject, selectedFile }) => (
  <Card style={{ padding: '30px' }}>
    <SectionHeader
      icon="👁️"
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
            "date-fns":"^4.1.0"
          }
        }}
      />
    </div>
  </Card>
);
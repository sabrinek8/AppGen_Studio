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
            "react-native-web": "0.18.12",
             "@react-navigation/native": "^6.1.6",
            "@react-navigation/stack": "^6.3.20",
            "react-native-screens": "^3.27.0",
            "react-native-safe-area-context": "^4.7.4",
            "react-native-gesture-handler": "^2.13.4",
            "@expo/vector-icons": "14.1.0"
                      }
        }}
      />
    </div>
  </Card>
);
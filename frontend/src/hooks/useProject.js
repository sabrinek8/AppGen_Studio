import { usePersistentState } from './usePersistentState';

const defaultProject = {
  "/App.js": `import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import Button from './components/Button';
import Counter from './components/Counter';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.app}>
      <Text style={styles.title}>Mon Application React Native Web</Text>
      <Counter count={count} />
      <View style={styles.buttonContainer}>
        <Button onPress={() => setCount(count + 1)} text="Incrémenter" />
        <Button onPress={() => setCount(count - 1)} text="Décrémenter" />
        <Button onPress={() => setCount(0)} text="Reset" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  }
});`,
  "/components/Button.js": `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native-web';

export default function Button({ onPress, text, disabled = false }) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: '#888',
  }
});`,
  "/components/Counter.js": `import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';

export default function Counter({ count }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Compteur:</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4ecdc4',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center'
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});`
};

export const useProject = () => {
  const [currentProject, setCurrentProject] = usePersistentState('currentProject', defaultProject);
  const [selectedFile, setSelectedFile] = usePersistentState('selectedFile', "/App.js");

  const resetProject = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le projet ?")) {
      setCurrentProject(defaultProject);
      setSelectedFile("/App.js");
      return true;
    }
    return false;
  };

  const importProject = (projectData) => {
    setCurrentProject(projectData);
    const firstFile = Object.keys(projectData)[0];
    setSelectedFile(firstFile);
  };

  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'react-native-project.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    currentProject,
    selectedFile,
    setSelectedFile,
    resetProject,
    importProject,
    exportProject
  };
};
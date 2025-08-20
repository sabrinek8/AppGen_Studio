import './App.css';
import ReactCodePreview from './components/ReactCodePreview';
import { TranslationProvider } from './contexts/TranslationContext';

function App() {
  return (
    <TranslationProvider>
      <div className="App">
        <ReactCodePreview />
      </div>
    </TranslationProvider>
  );
}

export default App;
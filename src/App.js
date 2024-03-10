import logo from './logo.svg';
import './App.css';
import CurrencyExchange from './CurrencyExchange';
import { ToastProvider } from './ToastContext';

function App() {
  return (
    <div className="App">
       <ToastProvider>

    <CurrencyExchange/>
       </ToastProvider>
    </div>
  );
}

export default App;

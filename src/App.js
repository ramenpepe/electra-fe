import logo from './logo.svg';
import './App.css';
import Grid from "./Grid";


const originalFetch = window.fetch;

// Override the global fetch function with your custom implementation
window.fetch = function(url, options) {
  console.log(url);
  // Modify the 'url' variable here with your desired changes
  // For example, prepend a proxy URL or modify headers
  const urlWithoutProtocol = url.replace(/^(https?:\/\/)/, '');
  // Example modification: prepend a proxy URL
  const modifiedUrl = 'https://queryticket.000webhostapp.com/electra.php?uri=' + urlWithoutProtocol;

  // Make the actual fetch request with the modified URL and options
  return originalFetch(modifiedUrl, options);
};

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <Grid />
    </div>
  );
}

export default App;

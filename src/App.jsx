import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scanner from "./pages/Scanner.jsx";
import Demo from "./pages/Demo.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
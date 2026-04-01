import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="flex min-h-[100dvh] items-center justify-center px-4">Ebook App</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

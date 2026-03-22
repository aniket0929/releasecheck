import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReleaseList from "./pages/ReleaseList";
import ReleaseDetail from "./pages/ReleaseDetail";
;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReleaseList />} />
        <Route path="/release/:id" element={<ReleaseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
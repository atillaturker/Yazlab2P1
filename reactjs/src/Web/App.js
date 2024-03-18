// App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Homepage'

function App() {
  // Diğer kodlar...

  return (
    <Routes>
        <Route path='/' element={<Homepage/>} />
    </Routes>
  );
}

export default App;

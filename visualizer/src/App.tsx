import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import { TweetGraph } from './TweetGraph';

function App() {
  return (
    <div className="App height-100">
      <Routes>
        <Route path="/" element={<TweetGraph className="height-100 width-100" />} />
        {/* <Route path="about" element={<About />} /> */}
      </Routes>
    </div>
  );
}

export default App;
       
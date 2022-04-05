import { ChangeEvent } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import './App.css';
import { TweetGraph } from './TweetGraph';
import { ForceGraph } from './ForceGraph';

const routes = [
  {
    path: '/',
    component: TweetGraph
  },
  {
    path: '/force-graph',
    component: ForceGraph
  }
]

const Header = (({ }) => {
  let navigate = useNavigate();
  let location = useLocation();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => navigate(event.target.value);

  return (
    <header>
      <select defaultValue={location.pathname} onChange={onChange}>
        {routes.map((route) => (
          <option value={route.path} key={route.path}>
            {route.path === '/' ? 'Bubble pack' : route.path.substr(1, route.path.length)}
          </option>
        ))}
      </select>
    </header>
  );
});

function App() {
  return (
    <div className="App height-100">
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route path={route.path} element={<route.component className="height-100 width-100"/>} key={route.path} />
        ))}
        {/* <Route path="/" element={<TweetGraph className="height-100 width-100" />} /> */}
      </Routes>
    </div>
  );
}

export default App;

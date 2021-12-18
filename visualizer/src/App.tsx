import './App.css';
import { TweetGraph } from './TweetGraph';

const data = [
  {id: "1472214916476317698", author_username: "kazamairohach"},
  {id: "1472214916476317698", author_username: "kazamairohach"},
  {id: "1472214916476317698", author_username: "kazamairohach"},
  {id: "1472214916476317698", author_username: "kazamairohach"},

  {id: "1472213088468631556", author_username: "hakuikoyori"},
  {id: "1472213088468631556", author_username: "hakuikoyori"},
  {id: "1472213088468631556", author_username: "hakuikoyori"},

  {id: "1472208806826627074", author_username: "yukihanalamy"},
]

function App() {
  return (
    <div className="App">
      <TweetGraph data={data} />
    </div>
  );
}

export default App;
       
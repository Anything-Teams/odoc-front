// import { useEffect, useState } from 'react';
// 
// function App() {
//   const [data, setData] = useState("");
// 
//   useEffect(() => {
//     fetch("http://localhost:8080/test")
//       .then(res => res.text())
//       .then(setData);
//   }, []);
// 
//   return <div>{data}</div>;
// }
// 
// export default App;

import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
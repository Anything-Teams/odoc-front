// import { useEffect, useState } from 'react';
// import { apiFetch } from "./api/api";

// function App() {
//   const [data, setData] = useState("");
  
//   useEffect(() => {
//     apiFetch("/test")
//       .then(res => res.text())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   return <div>{data}</div>;
// }

// export default App;


import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
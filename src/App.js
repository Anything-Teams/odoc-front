
// import { useEffect, useState } from 'react';
// import { get, post } from "./api/api";

// function App() {
//   const [data, setData] = useState("");
  
//   // GET방식
//   useEffect(() => {
//     get("/test", {
//       testId: "testtest1",
//       testNm: "testName",
//     })
//       .then((data) => setData(data.testNm))
//       .catch(console.error);
//   }, []);

//   // POST 방식
//   // useEffect(() => {
//   //   post("/test", {
//   //     testId: "testtest1",
//   //     testNm: "testName",
//   //   })
//   //   .then((data) => setData(data.testNm))
//   //   .catch(console.error);
//   // }, []);

//   return <div>{data}</div>;
// }

// export default App;



import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
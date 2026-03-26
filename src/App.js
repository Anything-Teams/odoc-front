import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./common/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
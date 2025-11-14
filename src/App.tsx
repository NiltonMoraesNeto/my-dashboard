import { AuthProvider } from "./contexts/auth-context";
import { AppRouter } from "./router";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="w-full overflow-hidden">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;

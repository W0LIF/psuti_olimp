
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./app/components/CurrencyContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <App />
      <Toaster />
    </CurrencyProvider>
  </AuthProvider>
);

  
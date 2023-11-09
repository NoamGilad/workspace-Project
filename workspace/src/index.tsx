import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import { DimensionsProvider } from "./contexts/DimensionsProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthProvider>
    <DimensionsProvider>
      <App />
    </DimensionsProvider>
  </AuthProvider>
);

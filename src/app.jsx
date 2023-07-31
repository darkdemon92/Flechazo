import "./app.css";
import Container from "@mui/material/Container";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

export function App() {
  return (
    <Container>
      <BrowserRouter>
        <Toaster position="top-center" expand={true} richColors />
        <AppRoutes />
      </BrowserRouter>
    </Container>
  );
}

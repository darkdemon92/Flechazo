import "./app.css";
//import { useState, useEffect } from "preact/hooks";
import Container from "@mui/material/Container";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export function App() {
  return (
    <Container>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Container>
  );
}

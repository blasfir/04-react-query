// src/main.tsx

//import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
// Нормалізація стилів
import "modern-normalize";
// Глобальні стилі (додатково)
import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

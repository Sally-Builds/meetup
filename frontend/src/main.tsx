import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/react";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";

// const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <ChakraProvider>
      <ScaleFade in transition={{ enter: { duration: 2.5 } }}>
        <App />
      </ScaleFade>
    </ChakraProvider>
    {/* </QueryClientProvider> */}
  </StrictMode>
);

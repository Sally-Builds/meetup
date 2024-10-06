import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/react";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <ScaleFade in transition={{ enter: { duration: 2.5 } }}>
        <App />
      </ScaleFade>
    </ChakraProvider>
  </StrictMode>
);

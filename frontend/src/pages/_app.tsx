import "../styles/globals.css";

import type { AppProps } from "next/app";
import { UserProvider } from "../contexts/UserContext";
import { ProjectProvider } from "../contexts/ProjectContext";
import { IsMouseHoveringProvider } from "../contexts/IsMouseHovering";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>  
      <ProjectProvider>
        <IsMouseHoveringProvider>
          <Component {...pageProps} /> 
        </IsMouseHoveringProvider>
      </ProjectProvider>
    </UserProvider>
  );
}


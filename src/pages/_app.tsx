import "../styles/globals.css";

import type { AppProps } from "next/app";
import { UserProvider } from "../contexts/UserContext";
import { ProjectProvider } from "../contexts/ProjectContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>  
      <ProjectProvider>
          <Component {...pageProps} /> 
        </ProjectProvider>
    </UserProvider>
  );
}


import { useEffect } from "react";

const useInputInjector = () => {
  useEffect(() => {
    // It's isolated world we can't get actual DOM properties
    // Solution: https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("/inject-input-upload.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }, []);
};

export default useInputInjector;

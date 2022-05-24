import Wrapper from "./components/Wrapper";
import LoadQueryFeature from "./features/load-query";
import SaveQueryFeature from "./features/save-query";
import useInputInjector from "./hooks/useInputInjector";
import useData from "./hooks/useData";

import "@awsui/global-styles/index.css";

function App() {
  const { savedQueries, refetchLocalStorage } = useData();
  useInputInjector();

  return (
    <Wrapper>
      <LoadQueryFeature
        items={savedQueries}
        onRemoveItem={refetchLocalStorage}
      />
      <SaveQueryFeature onSaveItem={refetchLocalStorage} />
    </Wrapper>
  );
}

export default App;

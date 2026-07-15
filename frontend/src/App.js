import React, { useState } from "react";
import Navbar from "./components/Navbar";
import RequestForm from "./components/RequestForm";
import RequestList from "./components/RequestList";

function App() {
  const [view, setView] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
    setView("list");
  };

  return (
    <div className="app">
      <Navbar view={view} setView={setView} />
      <main className="main-content">
        {view === "list" ? (
          <RequestList refreshKey={refreshKey} />
        ) : (
          <RequestForm onCreated={handleCreated} />
        )}
      </main>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from ".//Components/Form";
import FormDataDisplay from "./Components/FormDataDisplay";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/submitted" element={<FormDataDisplay />} />
      </Routes>
    </Router>
  );
};

export default App;

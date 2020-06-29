import { h } from "preact";
import { Router } from "preact-router";

import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <Router>
      <HomePage default />
    </Router>
  );
}

import { h } from "preact";
import type { FunctionalComponent } from "preact";

interface HomePageProps {}

export const HomePage: FunctionalComponent<HomePageProps> = () => {
  return (
    <main>
      <h1>Home Page</h1>
      <p>This is a test, for now.</p>
    </main>
  );
};

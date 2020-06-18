import { h, FunctionalComponent } from "preact";
import { useState, useEffect, useRef, Ref } from "preact/hooks";
import { fromEvent } from "rxjs";
import { springThen } from "@nll/motion/rxjs";

import { notNil } from "../libs/typeguards";

interface HomePageProps {}

const CONFIG = { mass: 10, tension: 100, friction: 12 };
const PATH = {
  from: { x: 0, y: 0 },
  to: { x: 400, y: 400 },
  velocity: { x: 0, y: 0 },
};

const Spring: FunctionalComponent<{
  title?: string;
  forwardRef: Ref<HTMLParagraphElement | null>;
}> = ({ title = "Hello World", forwardRef }) => {
  return (
    <p ref={forwardRef} class="ps-fix">
      {title}
    </p>
  );
};

export const HomePage: FunctionalComponent<HomePageProps> = () => {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const y = springThen(CONFIG, {
      from: 0,
      to: 100,
    });
    const x = springThen(CONFIG, { from: 0, to: 100 });

    const ysub = y.position$.subscribe((v) => {
      if (notNil(ref.current)) {
        ref.current.style.top = `${v}px`;
      }
    });

    const xsub = x.position$.subscribe((v) => {
      if (notNil(ref.current)) {
        ref.current.style.left = `${v}px`;
      }
    });

    const sub = fromEvent<MouseEvent>(document, "click").subscribe((event) => {
      x.next(event.offsetX);
      y.next(event.offsetY);
      console.log("Status", { x: x.status(), y: y.status() });
    });

    return () => {
      sub.unsubscribe();
      ysub.unsubscribe();
      xsub.unsubscribe();
    };
  }, [ref.current]);

  return (
    <main>
      <h1>Home Page</h1>
      <p>This is a test, for now.</p>
      <Spring forwardRef={ref} />
    </main>
  );
};

import "../styles/globals.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
function MyApp({ Component, pageProps }) {
  const credentials = {
    nome: "Lucas Fernandes Leite dos Santos",
    login: "LucasFernandes",
    password: "Suporte123",
    accessibleRoutes: ["O&M"],
    admin: true,
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Component credentials={credentials} {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;

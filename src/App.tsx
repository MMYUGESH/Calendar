import { Container, CssBaseline } from "@mui/material";
import { Calendar } from "./components/calendar";

export const App = () => {
  return (
    <>
      <CssBaseline />

      <Container maxWidth="xl" sx={{ paddingY: 3 }}>
        <Calendar />
      </Container>
    </>
  );
};

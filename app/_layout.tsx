import { Stack } from "expo-router";
import { LembreteProvider } from "./context/LembreteContext";

export default function Layout() {
  return (
    <LembreteProvider>
      <Stack />
    </LembreteProvider>
  );
}

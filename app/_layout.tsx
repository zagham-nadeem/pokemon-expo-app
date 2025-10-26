import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Pokemon List" }} />
      <Stack.Screen
        name="details"
        options={{
          headerBackButtonDisplayMode: "minimal",
          presentation: "modal",
          sheetAllowedDetents:[0.5, 0.75, 1],
          sheetGrabberVisible: true,
          headerShown: true,
        }}
      />
    </Stack>
  );
}

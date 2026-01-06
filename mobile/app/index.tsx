import "../global.css";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../src/store/authStore";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setHasToken(!!token);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return hasToken ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}

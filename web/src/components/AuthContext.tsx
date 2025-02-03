import { routes } from "@/api";
import {
  createContext,
  createSignal,
  useContext,
  onCleanup,
  onMount,
  ParentProps,
  Setter,
  Accessor
} from "solid-js";

type AuthContextType = {
  user: Accessor<User | null>,
  setUser: Setter<User | null>,
  status: Accessor<Status | null>,
  setStatus: Setter<Status>,
  loading: Accessor<boolean>,
  fetchUser: () => Promise<void>
  revalidate: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type User = { user_id: number, email: string };
export type Status = "authenticated" | "unauthenticated" | "loading"
const MINUTE = 1000 * 60;
const HALF_HOUR = 30 * MINUTE;

export const AuthProvider = (props: ParentProps) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [status, setStatus] = createSignal<Status>("loading");
  const [loading, setLoading] = createSignal(true);

  let intervalId: NodeJS.Timeout;

  const fetchUser = async () => {
    try {
      const response = await fetch(routes.apiMe, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data in fetchUser before setUser: ", data);
        setUser(data);
        setStatus("authenticated");
      } else {
        console.log("this happended: ", await response.text())
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setStatus("unauthenticated");
    } finally {
      setLoading(false);
    }
  };

  const revalidate = async () => {
    await fetchUser();
  }

  onMount(async () => {
    const u = await fetchUser();
    console.log("fetchUser in onMount: ", u);

    intervalId = setInterval(async () => {
      await fetchUser();
    }, HALF_HOUR);
  });

  // Clean up interval on unmount
  onCleanup(() => {
    clearInterval(intervalId);
  });

  return (
    <AuthContext.Provider value={{ user, setUser, status, setStatus, loading, fetchUser, revalidate }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

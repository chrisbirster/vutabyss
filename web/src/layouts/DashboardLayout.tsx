import { css } from "@linaria/core";
import { Match, ParentProps, Show, Switch } from "solid-js";
import { Navigate } from "@solidjs/router";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Sidebar } from "@/components/Sidbar";

const layout = css`
  display: flex; 
  flex-direction: row;
  height: 100vh;
`;

const content = css`
  flex: 1;
  background-color: #f4f4f8;
  overflow-y: auto;
`;

export default function DashboardLayout(props: ParentProps) {
  return (
    <AuthProvider>
      <div class={layout}>
        <Sidebar />
        <div class={content}>
          <DashboardContent {...props} />
        </div>
      </div>
    </AuthProvider>
  )
}

const DashboardContent = (props: ParentProps) => {
  const { status, loading } = useAuth();

  return (
    <Show when={!loading()} fallback={<p>Loading...</p>}>
      <Switch fallback={<Navigate href="/login" />}>
        <Match when={status() === "authenticated"}>
          {props.children}
        </Match>
        <Match when={status() === "unauthenticated"}>
          <Navigate href="/login" />
        </Match>
        <Match when={status() === "loading"}>
          <p>Authenticating...</p>
        </Match>
      </Switch>
    </Show>
  );
};

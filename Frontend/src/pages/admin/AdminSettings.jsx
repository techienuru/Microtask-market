import React from "react";
import { RefreshCw, Users, Clock, Zap } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";

export const AdminSettings = () => {
  const { state, updateState, switchUser, updateTask } = useAppState();

  return (
    <main class="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-1">
        <Aside />
        <section class="flex-1 p-4 sm:p-6 bg-background-light dark:bg-background-dark"></section>
      </div>
    </main>
  );
};

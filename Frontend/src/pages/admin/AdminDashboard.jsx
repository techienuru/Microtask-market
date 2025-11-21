import React from "react";
import { RefreshCw, Users, Clock, Zap } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";
import { Aside } from "../../components/Aside.jsx";

export const AdminDashboard = () => {
  const { state, updateState, switchUser, updateTask } = useAppState();

  return (
    <main class="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-1">
        <Aside />
        <section class="flex-1 p-4 sm:p-6 bg-background-light dark:bg-background-dark">
          <section>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col items-center justify-center text-center">
                <p class="text-sm font-medium text-muted-light dark:text-muted-dark">
                  Active Tasks
                </p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                  123
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col items-center justify-center text-center">
                <p class="text-sm font-medium text-muted-light dark:text-muted-dark">
                  Flagged
                </p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                  45
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col items-center justify-center text-center">
                <p class="text-sm font-medium text-muted-light dark:text-muted-dark">
                  Users
                </p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                  678
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col items-center justify-center text-center">
                <p class="text-sm font-medium text-muted-light dark:text-muted-dark">
                  Escrow Holds
                </p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                  $90
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2 class="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
              Recent Actions
            </h2>
            <div class="space-y-2">
              <div class="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">
                  Task Completed
                </p>
                <p class="text-sm text-muted-light dark:text-muted-dark">
                  User A completed Task X
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">
                  Task Posted
                </p>
                <p class="text-sm text-muted-light dark:text-muted-dark">
                  User B posted Task Y
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">
                  Task Flagged
                </p>
                <p class="text-sm text-muted-light dark:text-muted-dark">
                  User C flagged Task Z
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">
                  Task Completed
                </p>
                <p class="text-sm text-muted-light dark:text-muted-dark">
                  User D completed Task W
                </p>
              </div>
              <div class="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">
                  Task Posted
                </p>
                <p class="text-sm text-muted-light dark:text-muted-dark">
                  User E posted Task V
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

import React from "react";
import { RefreshCw, Users, Clock, Zap } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";
import { Aside } from "../../components/Aside.jsx";

export const AdminUsers = () => {
  const { state, updateState, switchUser, updateTask } = useAppState();

  return (
    <main class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex flex-1">
        <Aside />
        <section class="flex-1 p-4 sm:p-6 bg-background-light dark:bg-background-dark">
          <div class="mb-6">
            <label class="relative block">
              <span class="sr-only">Search</span>
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-subtle-light dark:text-subtle-dark">
                <svg
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </span>
              <input
                class="placeholder:text-subtle-light dark:placeholder:text-subtle-dark block bg-white dark:bg-background-dark w-full border border-primary/20 dark:border-primary/30 rounded-lg py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 text-content-light dark:text-content-dark"
                name="search"
                placeholder="Search for users..."
                type="text"
              />
            </label>
          </div>
          <div class="space-y-4">
            <div class="bg-white dark:bg-background-dark/50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  alt="Ethan Carter"
                  class="h-12 w-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD130OhS6D2BY637zslfWaziFsSDtaHg9Hn0dcBkEOneDu06Vfsbt5gGikFMMy_OjQqyoViSa8iLhD_6PI4MV3FntaDRAhBJwSGqpij7eOd3u8FE2XW1qpe1rY7gw7mtE7qaSfe_u15KX0S34pUr6baIMTQHIW6wa5MpEHLfovkf_VhNBqmQHn8qmFo4iZzb-_bemgKm6mYGOa38Q7jWLGDr0l_S4kdwkV34hD1dF9fWzv9PL2ChifFBTzUkCXfyjuKvv2geN4vMniH"
                />
                <div>
                  <p class="font-semibold text-content-light dark:text-content-dark">
                    Ethan Carter
                  </p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">
                    Joined 2023-01-15
                  </p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  checked=""
                  class="sr-only peer"
                  type="checkbox"
                  value=""
                />
                <div class="w-11 h-6 bg-subtle-light/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-subtle-dark/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-content-light dark:text-content-dark">
                  Ban
                </span>
              </label>
            </div>
            <div class="bg-white dark:bg-background-dark/50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  alt="Olivia Bennett"
                  class="h-12 w-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV5bBjnOK74p_gCCCOYq_11CbnOhCjL3jpxZqzZtQOVMj_cg6Koo6Dq94y-z5qby3JxUu0q6g7UXQWF5k3obENeJUejOYsdZ8BDuBpvvrAC6EU9_DqQM-bQGRBp3wxzv96ZM3gSmAz3rZYlgPPtwemTxdUu2m0K7Aq_clWZTtpc-D0Zkz6ugs5qcCBzF-SXxPWxoc0RN9c2H-hU5NoYLi5WRQ_ALpQB13eJYhU7mGED-wU2SfYlpihjacaFNZbC2P_JV2e8FLsHg7t"
                />
                <div>
                  <p class="font-semibold text-content-light dark:text-content-dark">
                    Olivia Bennett
                  </p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">
                    Joined 2023-02-20
                  </p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input class="sr-only peer" type="checkbox" value="" />
                <div class="w-11 h-6 bg-subtle-light/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-subtle-dark/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-content-light dark:text-content-dark">
                  Ban
                </span>
              </label>
            </div>
            <div class="bg-white dark:bg-background-dark/50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  alt="Noah Thompson"
                  class="h-12 w-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmQCkI7J4_APKBa45NgF2fxVyaWH3T4hByRZ-RdXMh9GPiyXgLNOgLBJ44QOp4r3g8A2sQLeNV9EJVdqqFkugZrCx84jSVuHhfbchAzG_LQ0h2T1ujfxw7uPWpO8TRGVKcetF9Y2QFRjSu_4Ui0I0JwKP5MwNUt7AVTsvKbB0oz7Sfd7BFC6U9Fgi25j0JX04L3TXaY5dpXtyyWgo_BhL18l7FyZzQKUghdLjXpUvOaFg0O_sYWk3u7tOS5QFifVTzpAA6LwfB36qT"
                />
                <div>
                  <p class="font-semibold text-content-light dark:text-content-dark">
                    Noah Thompson
                  </p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">
                    Joined 2023-03-10
                  </p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input class="sr-only peer" type="checkbox" value="" />
                <div class="w-11 h-6 bg-subtle-light/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-subtle-dark/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-content-light dark:text-content-dark">
                  Ban
                </span>
              </label>
            </div>
            <div class="bg-white dark:bg-background-dark/50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  alt="Ava Martinez"
                  class="h-12 w-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVCKkH2mythln8lB2oY-p-N1sV42UtuXs26IQXeflK2t3fjhQi9qhdORmk1ZreezTEEksCDEK1wzf28ksYI29eMEtLM-21zNXMVWiwI7PxQfN6KoOKuTamAcHyMYJnUNRqeDant7BzJLskUUYejJhrIbR8sk-cthUNSb2et5FHqyofss2u2mPBYFkMzN8YRVpcvM4Rin6f6VpOx0ZnXk_Xw52YyL4_3aj5B-aYXDrKCV02Gha-c0rRoVdVNvhV1O3N01DR2ZzNWjJu"
                />
                <div>
                  <p class="font-semibold text-content-light dark:text-content-dark">
                    Ava Martinez
                  </p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">
                    Joined 2023-04-05
                  </p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  checked=""
                  class="sr-only peer"
                  type="checkbox"
                  value=""
                />
                <div class="w-11 h-6 bg-subtle-light/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-subtle-dark/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-content-light dark:text-content-dark">
                  Ban
                </span>
              </label>
            </div>
            <div class="bg-white dark:bg-background-dark/50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  alt="Liam Harris"
                  class="h-12 w-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIB_2uXOtWjjVwxT8EI8qcajKDMEb22sqJaM0cbgV3jfM8_miAREgEraDC5Yxsv59_OxCoXc9QIqYgSnkAEyAn6qOCDKOTNnw49J-5_vX7L8CzveY30Mw_CNNiZ1cx0SylcCETTvLHKl8aG4va2HjrFOwvei6zVeFbF7F1CBkNn8BQhQBuoyRS49YCHtHfc_FrNBoMHkucE3hdxoKkS3ioFAGq254vBx-0azM-iNeeGX21budThEw9vtkrAyW29DsVFmg2Axse103u"
                />
                <div>
                  <p class="font-semibold text-content-light dark:text-content-dark">
                    Liam Harris
                  </p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">
                    Joined 2023-05-12
                  </p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input class="sr-only peer" type="checkbox" value="" />
                <div class="w-11 h-6 bg-subtle-light/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-subtle-dark/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-content-light dark:text-content-dark">
                  Ban
                </span>
              </label>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

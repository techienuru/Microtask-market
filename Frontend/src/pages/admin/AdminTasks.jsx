import React from "react";
import { RefreshCw, Users, Clock, Zap } from "lucide-react";
import { useAppState } from "../../hooks/useAppState.js";
import { Aside } from "../../components/Aside.jsx";

export const AdminTasks = () => {
  const { state, updateState, switchUser, updateTask } = useAppState();

  return (
    <main class="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-1">
        <Aside />
        <section class="flex-1 p-4 sm:p-6 bg-background-light dark:bg-background-dark">
          <main class="flex-1 flex flex-col">
            <div class="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div class="text-[#111418] dark:text-white flex size-12 shrink-0 items-center lg:hidden">
                <button class="lg:hidden" id="open-nav-button">
                  <span class="material-symbols-outlined text-[#111418] dark:text-white">
                    menu
                  </span>
                </button>
              </div>
              <h2 class="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
                Tasks
              </h2>
              <div class="flex items-center justify-end gap-2">
                <button class="hidden sm:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span class="truncate">Seed DB</span>
                </button>
                <button class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#111418] dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 w-12">
                  <span class="material-symbols-outlined text-[#111418] dark:text-white">
                    notifications
                  </span>
                </button>
                <div class="flex items-center gap-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  <img
                    class="w-8 h-8 rounded-full object-cover"
                    data-alt="Admin user avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Az4l25UyFr-GGmzc0-zBg3UFRdaZzosxv0JflOFRNheRYHPZAW-FgzocoiQcqPSf7bhn6FXz0vH7OV5-iJIBq2NmOps7c04vvm94JrlnNZS4sPDESdB33469MxWHN9yg0TpXfJevi05utW_vlOMIN7ziYtjzwe9ouvJn-Gn-3zoF8SdYrrmDz-SKN64aAoBvZuSZR9TARxh_4zid5ycjXwxTELCy9GeP2uNIwx-iWW9bwcnwHwsZRkQS9xvFtdrKAQyl1nowz9Qq"
                  />
                  <span class="text-sm font-medium mr-2 hidden sm:inline text-[#111418] dark:text-white">
                    Admin
                  </span>
                </div>
              </div>
            </div>
            {/* <!-- Filters Section --> */}
            <div class="flex flex-col p-4 gap-4 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
              {/* <!-- Status Chips --> */}
              <div class="flex gap-3 overflow-x-auto pb-2 -mb-2">
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-primary pl-4 pr-4">
                  <p class="text-white text-sm font-medium leading-normal">
                    All
                  </p>
                </div>
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] dark:bg-gray-700 pl-4 pr-4">
                  <p class="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                    Active
                  </p>
                </div>
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] dark:bg-gray-700 pl-4 pr-4">
                  <p class="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                    Reserved
                  </p>
                </div>
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] dark:bg-gray-700 pl-4 pr-4">
                  <p class="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                    Completed
                  </p>
                </div>
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] dark:bg-gray-700 pl-4 pr-4">
                  <p class="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                    Paid
                  </p>
                </div>
                <div class="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] dark:bg-gray-700 pl-4 pr-4">
                  <p class="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                    Flagged
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="lg:col-span-2">
                  <label class="flex flex-col min-w-40 h-12 w-full">
                    <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
                      <div class="text-[#60718a] dark:text-gray-400 flex border-none bg-[#f0f2f5] dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg border-r-0">
                        <span class="material-symbols-outlined">search</span>
                      </div>
                      <input
                        class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] dark:bg-gray-700 focus:border-none h-full placeholder:text-[#60718a] dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                        placeholder="Search by title or poster name..."
                        value=""
                      />
                    </div>
                  </label>
                </div>
                <label class="flex flex-col min-w-40 h-12 w-full">
                  <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div class="text-[#60718a] dark:text-gray-400 flex border-none bg-[#f0f2f5] dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <span class="material-symbols-outlined">
                        calendar_today
                      </span>
                    </div>
                    <input
                      class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] dark:bg-gray-700 focus:border-none h-full placeholder:text-[#60718a] dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Date Range"
                      value=""
                    />
                  </div>
                </label>
                <select class="form-select w-full h-12 rounded-lg text-[#111418] dark:text-white bg-[#f0f2f5] dark:bg-gray-700 border-none focus:ring-0">
                  <option>Mode: All</option>
                  <option>Single</option>
                  <option>Applications</option>
                </select>
              </div>
              {/* <!-- Action Buttons --> */}
              <div class="flex justify-stretch">
                <div class="flex flex-1 gap-3 flex-wrap justify-start">
                  <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                    <span class="truncate">Apply Filters</span>
                  </button>
                  <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                    <span class="truncate">Reset</span>
                  </button>
                </div>
              </div>
            </div>
            {/* <!-- Main Content Area --> */}
            <div class="flex-1 p-4 overflow-x-auto">
              {/* <!-- Task Table --> */}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th class="p-4" scope="col">
                          <div class="flex items-center">
                            <input
                              class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              id="checkbox-all"
                              type="checkbox"
                            />
                            <label class="sr-only" for="checkbox-all">
                              checkbox
                            </label>
                          </div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Task ID
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Title
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Pay (NGN)
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Date
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Poster
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Status
                        </th>
                        <th class="px-6 py-3" scope="col">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <!-- Sample Task Row 1 --> */}
                      <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="w-4 p-4">
                          <input
                            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary"
                            type="checkbox"
                          />
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          #83451
                        </td>
                        <td class="px-6 py-4 cursor-pointer text-primary hover:underline">
                          Redesign company website
                        </td>
                        <td class="px-6 py-4">75,000</td>
                        <td class="px-6 py-4">2023-10-26</td>
                        <td class="px-6 py-4">John Doe</td>
                        <td class="px-6 py-4">
                          <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            Paid
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <button>
                            <span class="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                      {/* <!-- Sample Task Row 2 --> */}
                      <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="w-4 p-4">
                          <input
                            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary"
                            type="checkbox"
                          />
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          #83452
                        </td>
                        <td class="px-6 py-4 cursor-pointer text-primary hover:underline">
                          Translate document
                        </td>
                        <td class="px-6 py-4">5,000</td>
                        <td class="px-6 py-4">2023-10-25</td>
                        <td class="px-6 py-4">Jane Smith</td>
                        <td class="px-6 py-4">
                          <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            Flagged
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <button>
                            <span class="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                      {/* <!-- Sample Task Row 3 --> */}
                      <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="w-4 p-4">
                          <input
                            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary"
                            type="checkbox"
                          />
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          #83453
                        </td>
                        <td class="px-6 py-4 cursor-pointer text-primary hover:underline">
                          Data Entry Project
                        </td>
                        <td class="px-6 py-4">12,000</td>
                        <td class="px-6 py-4">2023-10-25</td>
                        <td class="px-6 py-4">Mike Ross</td>
                        <td class="px-6 py-4">
                          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                            Reserved
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <button>
                            <span class="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                      {/* <!-- Sample Task Row 4 --> */}
                      <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="w-4 p-4">
                          <input
                            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary"
                            type="checkbox"
                          />
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          #83454
                        </td>
                        <td class="px-6 py-4 cursor-pointer text-primary hover:underline">
                          Social media management
                        </td>
                        <td class="px-6 py-4">30,000</td>
                        <td class="px-6 py-4">2023-10-24</td>
                        <td class="px-6 py-4">Sarah Connor</td>
                        <td class="px-6 py-4">
                          <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            Active
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <button>
                            <span class="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <!-- Pagination --> */}
                <nav
                  aria-label="Table navigation"
                  class="flex items-center justify-between p-4"
                >
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span class="font-semibold text-gray-900 dark:text-white">
                      1-10
                    </span>{" "}
                    of{" "}
                    <span class="font-semibold text-gray-900 dark:text-white">
                      1000
                    </span>
                  </span>
                  <ul class="inline-flex items-center -space-x-px">
                    <li>
                      <a
                        class="px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        href="#"
                      >
                        Prev
                      </a>
                    </li>
                    <li>
                      <a
                        class="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        href="#"
                      >
                        1
                      </a>
                    </li>
                    <li>
                      <a
                        class="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        href="#"
                      >
                        2
                      </a>
                    </li>
                    <li>
                      <a
                        class="px-3 h-8 text-primary border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        href="#"
                      >
                        3
                      </a>
                    </li>
                    <li>
                      <a
                        class="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        href="#"
                      >
                        ...
                      </a>
                    </li>
                    <li>
                      <a
                        class="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        href="#"
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </main>
        </section>
      </div>
    </main>
  );
};

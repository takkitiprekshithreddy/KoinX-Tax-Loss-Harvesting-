import React, { useState, useEffect, useMemo } from "react";
import { fetchCapitalGains, fetchHoldings } from "./data/mockApi";
import {
  calculatePreHarvesting,
  calculatePostHarvesting,
} from "./utils/calculations";
import PreHarvestingCard from "./components/TaxCards/PreHarvestingCard";
import PostHarvestingCard from "./components/TaxCards/PostHarvestingCard";
import HoldingsTable from "./components/HoldingsTable/HoldingsTable";
import ImportantNotes from "./components/ImportantNotes";
import HowItWorks from "./components/HowItWorks";
import Header from "./components/Header";

function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 bg-slate-50 dark:bg-[#050A15]">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        Fetching your holdings…
      </p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 bg-slate-50 dark:bg-[#050A15] p-6 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
        We couldn't load your holdings data. Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        Retry
      </button>
    </div>
  );
}

// Sun icon — shown when in dark mode (click to switch to light)
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

// Moon icon — shown when in light mode (click to switch to dark)
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function App() {
  // `holdings` is the immutable source array — never sort or mutate it directly.
  // All selection and calculation logic runs against this original data.
  const [holdings, setHoldings] = useState([]);
  const [baseGains, setBaseGains] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHoldingIds, setSelectedHoldingIds] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [gainsData, holdingsData] = await Promise.all([
        fetchCapitalGains(),
        fetchHoldings(),
      ]);
      setBaseGains(gainsData.capitalGains);
      setHoldings(holdingsData);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectHolding = (coinId) => {
    setSelectedHoldingIds((prev) => {
      const next = new Set(prev);
      if (next.has(coinId)) next.delete(coinId);
      else next.add(coinId);
      return next;
    });
  };

  // Checked against holdings.length so sorting in the table never affects this
  const isAllSelected = holdings.length > 0 && selectedHoldingIds.size === holdings.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedHoldingIds(new Set());
    } else {
      setSelectedHoldingIds(new Set(holdings.map((h) => h.coin)));
    }
  };

  // selectedAssets is derived from the original holdings array, not the sorted display order
  const selectedAssets = useMemo(
    () => holdings.filter((h) => selectedHoldingIds.has(h.coin)),
    [holdings, selectedHoldingIds]
  );

  const preHarvestingData = useMemo(
    () => (baseGains ? calculatePreHarvesting(baseGains) : null),
    [baseGains]
  );

  const postHarvestingData = useMemo(
    () => (baseGains ? calculatePostHarvesting(baseGains, selectedAssets) : null),
    [baseGains, selectedAssets]
  );

  const savings =
    preHarvestingData && postHarvestingData
      ? preHarvestingData.realisedGains - postHarvestingData.effectiveGains
      : 0;

  const showSavings =
    preHarvestingData &&
    postHarvestingData &&
    preHarvestingData.realisedGains > postHarvestingData.effectiveGains;

  if (loading) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <ErrorState onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Header />

      <div className="min-h-screen bg-slate-50 dark:bg-[#050A15] transition-colors p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto">

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tax Harvesting
              </h1>
              <HowItWorks />
            </div>

            <button
              id="theme-toggle"
              onClick={() => setIsDarkMode((prev) => !prev)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <ImportantNotes />

          <div className="flex flex-col lg:flex-row gap-6 mb-8 w-full">
            <PreHarvestingCard
              baseGains={baseGains}
              preHarvestData={preHarvestingData}
            />
            <PostHarvestingCard
              postHarvestData={postHarvestingData}
              showSavings={showSavings}
              savingsAmount={savings}
            />
          </div>

          {/* HoldingsTable always receives the original unsorted array so selection
              and gain calculations are never affected by the table's sort order */}
          <HoldingsTable
            holdings={holdings}
            selectedHoldingIds={selectedHoldingIds}
            onSelectHolding={handleSelectHolding}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

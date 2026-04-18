import React, { useState, useMemo } from 'react';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

// Shows the full value in a tooltip on hover (compact value shown by default)
const TooltipCell = ({ value, prefix = '' }) => (
  <div className="group relative inline-flex justify-end cursor-help w-full">
    <span>{prefix}{formatCompactCurrency(value)}</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded py-1 px-2 shadow-lg z-50 whitespace-nowrap">
      {prefix}{formatCurrency(value)}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
    </div>
  </div>
);

const SortIcon = ({ active, direction }) => (
  <span className={`ml-1 ${active ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`}>
    {active ? (direction === 'asc' ? '↑' : '↓') : '↕'}
  </span>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-4xl mb-3">📭</div>
    <p className="text-gray-500 dark:text-gray-400 font-medium">No holdings available</p>
    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
      Your portfolio holdings will appear here.
    </p>
  </div>
);

export default function HoldingsTable({
  holdings,
  selectedHoldingIds,
  onSelectHolding,
  onSelectAll,
  isAllSelected,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sorting only affects display order — selection and calculations always
  // use the original `holdings` array passed down from App.
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedHoldings = useMemo(() => {
    if (!sortConfig.key) return holdings;
    return [...holdings].sort((a, b) => {
      const aVal = sortConfig.key === 'stcg' ? a.stcg.gain : a.ltcg.gain;
      const bVal = sortConfig.key === 'stcg' ? b.stcg.gain : b.ltcg.gain;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [holdings, sortConfig]);

  const displayedHoldings = isExpanded ? sortedHoldings : sortedHoldings.slice(0, 4);

  // Drives the indeterminate state on the header checkbox
  const isSomeSelected = selectedHoldingIds.size > 0 && !isAllSelected;

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl shadow-md overflow-hidden transition-colors border border-transparent dark:border-slate-800">
      <h3 className="text-lg font-bold p-4 lg:p-6 border-b border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white">
        Holdings
      </h3>

      {holdings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <table className="w-full text-left text-sm whitespace-nowrap relative">
            <thead className="bg-gray-50 dark:bg-[#0B1426]/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="p-3 lg:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                    onChange={onSelectAll}
                    aria-label="Select all holdings"
                    className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 lg:p-4">Asset</th>
                <th className="p-3 lg:p-4 text-right">
                  Holdings
                  <br />
                  <span className="text-xs text-gray-400 font-normal">Avg Buy Price</span>
                </th>
                <th className="p-3 lg:p-4 text-right hidden sm:table-cell">Current Price</th>
                <th
                  className="p-3 lg:p-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none transition-colors"
                  onClick={() => handleSort('stcg')}
                >
                  Short-Term
                  <SortIcon active={sortConfig.key === 'stcg'} direction={sortConfig.direction} />
                </th>
                <th
                  className="p-3 lg:p-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none transition-colors"
                  onClick={() => handleSort('ltcg')}
                >
                  Long-Term
                  <SortIcon active={sortConfig.key === 'ltcg'} direction={sortConfig.direction} />
                </th>
                <th className="p-3 lg:p-4 text-right hidden md:table-cell">Amount to Sell</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {displayedHoldings.map((asset) => {
                const isSelected = selectedHoldingIds.has(asset.coin);

                return (
                  <tr
                    key={asset.coin}
                    onClick={() => onSelectHolding(asset.coin)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                        : 'border-l-2 border-l-transparent hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 lg:p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectHolding(asset.coin)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${asset.coinName}`}
                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    <td className="p-3 lg:p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={asset.logo}
                          alt={asset.coin}
                          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-[200px]">
                            {asset.coinName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {asset.coin}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 lg:p-4 text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {asset.totalHolding.toFixed(4)} {asset.coin}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(asset.averageBuyPrice)}
                      </div>
                    </td>

                    <td className="p-3 lg:p-4 text-right font-medium text-gray-900 dark:text-white hidden sm:table-cell">
                      <TooltipCell value={asset.currentPrice} />
                    </td>

                    <td className={`p-3 lg:p-4 text-right font-medium ${
                      asset.stcg.gain > 0
                        ? 'text-green-600 dark:text-green-400'
                        : asset.stcg.gain < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      <TooltipCell value={asset.stcg.gain} prefix={asset.stcg.gain > 0 ? '+' : ''} />
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {asset.stcg.balance > 0
                          ? `${asset.stcg.balance.toFixed(4)} ${asset.coin}`
                          : `0 ${asset.coin}`}
                      </div>
                    </td>

                    <td className={`p-3 lg:p-4 text-right font-medium ${
                      asset.ltcg.gain > 0
                        ? 'text-green-600 dark:text-green-400'
                        : asset.ltcg.gain < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      <TooltipCell value={asset.ltcg.gain} prefix={asset.ltcg.gain > 0 ? '+' : ''} />
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {asset.ltcg.balance > 0
                          ? `${asset.ltcg.balance.toFixed(4)} ${asset.coin}`
                          : `0 ${asset.coin}`}
                      </div>
                    </td>

                    <td className="p-3 lg:p-4 text-right font-medium text-gray-900 dark:text-white hidden md:table-cell">
                      {isSelected ? `${asset.totalHolding.toFixed(4)} ${asset.coin}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {holdings.length > 4 && (
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-blue-600 dark:text-blue-500 font-medium hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {isExpanded ? 'Show Less ↑' : `View All (${holdings.length}) ↓`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
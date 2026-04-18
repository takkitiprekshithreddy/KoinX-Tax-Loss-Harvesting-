import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function PreHarvestingCard({ baseGains, preHarvestData }) {
  if (!baseGains || !preHarvestData) return null;

  return (
    // Notice the addition of dark: classes here
    <div className="flex-1 bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white rounded-xl p-6 shadow-md border border-gray-100 dark:border-transparent transition-colors">
      <h2 className="text-xl font-semibold mb-6">Pre Harvesting</h2>
      
      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
        <div className="col-start-2 font-medium text-gray-500 dark:text-gray-400">Short-term</div>
        <div className="font-medium text-gray-500 dark:text-gray-400">Long-term</div>

        <div className="font-medium">Profits</div>
        <div>{formatCurrency(baseGains.stcg.profits)}</div>
        <div>{formatCurrency(baseGains.ltcg.profits)}</div>

        <div className="font-medium">Losses</div>
        <div>- {formatCurrency(baseGains.stcg.losses)}</div>
        <div>- {formatCurrency(baseGains.ltcg.losses)}</div>

        <div className="font-medium mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">Net Capital Gains</div>
        <div className="font-semibold mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
          {formatCurrency(preHarvestData.stcgNet)}
        </div>
        <div className="font-semibold mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
          {formatCurrency(preHarvestData.ltcgNet)}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <span className="font-semibold text-lg">Realised Capital Gains:</span>
        <span className="font-bold text-xl">{formatCurrency(preHarvestData.realisedGains)}</span>
      </div>
    </div>
  );
}
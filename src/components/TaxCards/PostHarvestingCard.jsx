import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function PostHarvestingCard({ postHarvestData, showSavings, savingsAmount }) {
  if (!postHarvestData) return null;

  return (
    <div className="flex-1 bg-blue-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
      <h2 className="text-xl font-semibold mb-6">After Harvesting</h2>
      
      <div className="grid grid-cols-3 gap-4 text-sm mb-6 relative z-10">
        <div className="col-start-2 font-medium text-blue-200">Short-term</div>
        <div className="font-medium text-blue-200">Long-term</div>

        <div className="font-medium">Profits</div>
        <div>{formatCurrency(postHarvestData.profits.stcg)}</div>
        <div>{formatCurrency(postHarvestData.profits.ltcg)}</div>

        <div className="font-medium">Losses</div>
        <div>- {formatCurrency(postHarvestData.losses.stcg)}</div>
        <div>- {formatCurrency(postHarvestData.losses.ltcg)}</div>

        <div className="font-medium mt-2 pt-2 border-t border-blue-500">Net Capital Gains</div>
        <div className="font-semibold mt-2 pt-2 border-t border-blue-500">
          {formatCurrency(postHarvestData.netGains.stcg)}
        </div>
        <div className="font-semibold mt-2 pt-2 border-t border-blue-500">
          {formatCurrency(postHarvestData.netGains.ltcg)}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-500 relative z-10">
        <span className="font-semibold text-lg">Effective Capital Gains:</span>
        <span className="font-bold text-xl">{formatCurrency(postHarvestData.effectiveGains)}</span>
      </div>

      {showSavings && (
        <div className="mt-4 pt-4 border-t border-blue-500 flex items-center gap-2 text-green-300 font-semibold relative z-10">
          🎉 <span>You are going to save upto {formatCurrency(savingsAmount)}</span>
        </div>
      )}
    </div>
  );
}
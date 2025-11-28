'use client';

import { useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { WHACK_A_MOLE_ABI, CONTRACT_ADDRESS } from '../app/abi';

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useAccount();

  const isTestnet = chain?.id === baseSepolia.id;
  const networkName = isTestnet ? 'Base Sepolia Testnet' : 'Base Mainnet';

  const { data: rawScores, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WHACK_A_MOLE_ABI,
    functionName: 'getTopScores',
    query: {
      enabled: isOpen, // Only fetch when open
    }
  });

  // Sort and take top 100
  const scores = rawScores 
    ? [...rawScores]
        .sort((a, b) => Number(b.score - a.score))
        .slice(0, 100)
    : [];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg font-bold transition-all z-50 flex items-center gap-2"
      >
        <span>🏆</span> Leaderboard
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50">
              <h2 className="text-2xl font-bold text-yellow-800 flex items-center gap-2">
                🏆 Top 100
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto p-0 flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : isError ? (
                <div className="p-8 text-center text-red-500">
                  Failed to load. Please ensure you are connected to {networkName}.
                </div>
              ) : scores.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No data yet. Be the first!</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 sticky top-0 shadow-sm">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600">Rank</th>
                      <th className="p-4 font-semibold text-gray-600">Player</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((item, index) => (
                      <tr key={`${item.player}-${index}`} className="border-b border-gray-50 hover:bg-yellow-50/50 transition-colors">
                        <td className="p-4 text-gray-500 font-mono w-16">
                          {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td className="p-4 font-mono text-sm text-blue-600 truncate max-w-[120px]" title={item.player}>
                          {item.player.slice(0, 6)}...{item.player.slice(-4)}
                        </td>
                        <td className="p-4 text-right font-bold text-gray-800">
                          {item.score.toString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
              Data loaded directly from {networkName} contract
            </div>
          </div>
        </div>
      )}
    </>
  );
}


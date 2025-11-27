'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { WHACK_A_MOLE_ABI, CONTRACT_ADDRESS } from './abi';
import Leaderboard from '../components/Leaderboard';

const MOLE_SPEED = 800; // 地鼠出现速度 800ms
const MAX_MISSES = 5;

export default function Home() {
  // 游戏状态
  const [score, setScore] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  
  // 使用 Ref 来即时跟踪 activeMole，供 setInterval 内部使用
  const activeMoleRef = useRef<number | null>(null);
  
  // Web3 状态
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // 读取最高分
  const { data: highScore, refetch: refetchHighScore } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WHACK_A_MOLE_ABI,
    functionName: 'getHighScore',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  // 同步 Ref
  useEffect(() => {
    activeMoleRef.current = activeMole;
  }, [activeMole]);

  // 游戏结束
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setActiveMole(null);
  }, []);

  // 检查 Miss 次数
  useEffect(() => {
    if (isPlaying && missedCount >= MAX_MISSES) {
      endGame();
      alert(`Game Over! You missed ${MAX_MISSES} moles. Final Score: ${score}`);
    }
  }, [missedCount, isPlaying, endGame, score]);

  // 开始游戏
  const startGame = () => {
    if (!isConnected) return alert('Please connect wallet first!');
    setScore(0);
    setMissedCount(0);
    setIsPlaying(true);
  };

  // 地鼠逻辑
  useEffect(() => {
    if (!isPlaying) return;

    const moleTimer = setInterval(() => {
      // 检查上一个地鼠是否被错过
      // 如果 activeMoleRef.current 不为 null，说明上一个地鼠还在，玩家没有打中 -> MISS
      if (activeMoleRef.current !== null) {
        setMissedCount(prev => prev + 1);
      }

      const randomIndex = Math.floor(Math.random() * 9);
      setActiveMole(randomIndex);
    }, MOLE_SPEED);

    return () => {
      clearInterval(moleTimer);
    };
  }, [isPlaying]);

  // 打地鼠处理
  const handleWhack = (index: number) => {
    if (!isPlaying || index !== activeMole) return;
    
    setScore((prev) => prev + 1);
    setActiveMole(null); // 打中后地鼠消失
  };

  // 提交分数上链
  const handleSubmitScore = async () => {
    if (score === 0) return alert('Score is 0, no need to submit');
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: WHACK_A_MOLE_ABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  // 监听交易确认，更新最高分
  useEffect(() => {
    if (isConfirmed) {
      refetchHighScore();
      alert('Score submitted successfully!');
    }
  }, [isConfirmed, refetchHighScore]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-stone-100">
      <Leaderboard />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-orange-600">Web3 Whack-A-Mole 🐹</h1>
        <ConnectButton />
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* 游戏信息面板 */}
        <div className="flex gap-8 text-xl font-bold bg-white p-6 rounded-xl shadow-lg text-gray-800">
          <div>Score: <span className="text-green-600">{score}</span></div>
          <div>Lives: <span className="text-red-600">
            {Array.from({ length: MAX_MISSES - missedCount }).map((_, i) => '❤️').join('')}
            {Array.from({ length: missedCount }).map((_, i) => '🖤').join('')}
          </span></div>
          <div>High Score: <span className="text-blue-600">{highScore ? Number(highScore) : 0}</span></div>
        </div>

        {/* 游戏网格 */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-amber-800 rounded-xl shadow-2xl">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              onClick={() => handleWhack(index)}
              className={`w-24 h-24 rounded-full cursor-pointer transition-all duration-100 border-4 border-amber-900 relative overflow-hidden
                ${activeMole === index ? 'bg-amber-300' : 'bg-amber-950'}
                hover:scale-105 active:scale-95`}
            >
              {activeMole === index && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                  🐹
                </div>
              )}
              <div className="absolute bottom-0 w-full h-1/3 bg-amber-900/30 rounded-b-full"></div>
            </div>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-col gap-4 items-center">
          {!isPlaying ? (
            <button
              onClick={startGame}
              disabled={!isConnected}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-bold text-xl shadow-lg transition-all"
            >
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
          ) : (
            <div className="text-xl font-bold text-orange-600 animate-pulse">
              Game in progress... Go!
            </div>
          )}

          {/* 游戏结束且有分数时显示提交按钮 */}
          {!isPlaying && score > 0 && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleSubmitScore}
                disabled={isPending || isConfirming}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Minting...' : 'Upload Score to Base'}
              </button>
              {hash && (
                <a 
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View Transaction: {hash.slice(0, 6)}...{hash.slice(-4)}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>Connect your wallet to play on Base Sepolia Testnet</p>
      </div>
    </main>
  );
}

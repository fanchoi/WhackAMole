'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const config = getDefaultConfig({
  appName: 'Web3 Whack-A-Mole',
  // ⚠️ 注意：请务必去 cloud.walletconnect.com 申请一个 Project ID 并替换这里
  // 如果不替换，连接钱包和获取余额可能会出现问题（显示 NaN 或连接失败）
  projectId: 'YOUR_PROJECT_ID', 
  chains: [
    baseSepolia,
    base,
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

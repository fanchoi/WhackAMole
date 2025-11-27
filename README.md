# Web3 Whack-A-Mole Game on Base

这是一个基于 Base 网络的 Web3 打地鼠游戏。

## 功能特性
- 🎮 经典打地鼠玩法 (9宫格, 5个生命点)
- 🔗 钱包连接 (RainbowKit + Wagmi)
- 📝 分数上链 (Smart Contract on Base)
- 🏆 链上最高分记录

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境
复制 `.env.example` 到 `.env` 并填入你的私钥和 WalletConnect Project ID。
```bash
cp .env.example .env
```
- `PRIVATE_KEY`: 用于部署合约的钱包私钥 (建议使用测试钱包)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: 从 [WalletConnect Cloud](https://cloud.walletconnect.com/) 获取

### 3. 部署智能合约 (Base Sepolia 测试网)
确保你的钱包在 Base Sepolia 有测试币 (ETH)。

```bash
npx hardhat ignition deploy ignition/modules/WhackAMole.ts --network baseSepolia
```

部署成功后，控制台会显示合约地址。

### 4. 更新前端配置
打开 `app/abi.ts`，将 `CONTRACT_ADDRESS` 替换为刚刚部署的合约地址。

```typescript
export const CONTRACT_ADDRESS = "0x..."; // 你的合约地址
```

### 5. 启动前端
```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可开始游戏！

## 技术栈
- **Frontend:** Next.js 15, TailwindCSS, TypeScript
- **Web3:** Wagmi, Viem, RainbowKit
- **Smart Contract:** Solidity, Hardhat
- **Network:** Base Sepolia (Testnet), Base Mainnet

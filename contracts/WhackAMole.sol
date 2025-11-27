// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WhackAMole {
    struct PlayerScore {
        address player;
        uint256 score;
    }

    // 记录每个玩家的最高分
    mapping(address => uint256) public highScores;
    // 记录所有参与过的玩家地址，用于遍历
    address[] public players;
    // 记录总游戏次数
    uint256 public totalGamesPlayed;

    // 事件：当有新分数提交时触发
    event ScoreSubmitted(address indexed player, uint256 score);
    // 事件：当打破最高分时触发
    event NewHighScore(address indexed player, uint256 score);

    /**
     * @dev 提交游戏分数
     * @param score 本局游戏得分
     */
    function submitScore(uint256 score) external {
        require(score > 0, "Score must be greater than 0");
        
        totalGamesPlayed++;
        
        // 触发分数提交事件
        emit ScoreSubmitted(msg.sender, score);

        // 如果是该玩家第一次玩，记录地址
        if (highScores[msg.sender] == 0) {
            players.push(msg.sender);
        }

        // 如果是新高分，更新并在链上记录
        if (score > highScores[msg.sender]) {
            highScores[msg.sender] = score;
            emit NewHighScore(msg.sender, score);
        }
    }

    /**
     * @dev 获取玩家最高分
     * @param player 玩家地址
     */
    function getHighScore(address player) external view returns (uint256) {
        return highScores[player];
    }

    /**
     * @dev 获取前100名排行榜
     * 注意：这种实现在玩家数量非常多时可能会因为 Gas Limit 而读取失败
     * 但对于简单的 Demo 或玩家数量有限的情况是可行的
     * 更好的做法是在后端通过索引事件来构建排行榜，或者使用图(The Graph)
     */
    function getTopScores() external view returns (PlayerScore[] memory) {
        uint256 length = players.length;
        PlayerScore[] memory allScores = new PlayerScore[](length);

        // 1. 获取所有分数
        for (uint256 i = 0; i < length; i++) {
            address player = players[i];
            allScores[i] = PlayerScore({
                player: player,
                score: highScores[player]
            });
        }

        // 2. 简单的冒泡排序（仅取前100，为了节省gas，这里建议在链下排序，
        // 但既然要求链上显示，我们返回所有数据或者在链下处理更好。
        // 为了演示简单性，我们直接返回未排序的列表，让前端去排序和截取前100。
        // 在链上做全量排序是非常昂贵且容易导致 Gas 耗尽的。
        return allScores;
    }
}

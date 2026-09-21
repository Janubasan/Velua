// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title JEVJournal - Journal of Error Vectors On-Chain Audit
 * @notice Todo trade e erro vai pra blockchain. Impossível falsificar.
 * @dev Deploy na Arbitrum por ~$0.30 - logs com link Arbiscan
 */
contract JEVJournal {
    struct TradeLog {
        string agentId;
        string action; // BUY, SELL, HOLD
        uint256 amount; // em wei ou satoshis * 1e6 para precisão
        int256 pnl; // PnL * 1e6 (permite negativos)
        string lesson; // lição aprendida
        string symbol; // BTC/USDT
        string errorType; // STOP_LOSS_HIT, NONE, etc
        uint256 timestamp;
        address trader; // quem executou
        string mode; // DEMO ou REAL
    }

    TradeLog[] public logs;
    mapping(string => uint256[]) public agentLogs; // agentId => indices
    mapping(address => uint256[]) public traderLogs;

    uint256 public totalTrades;
    int256 public totalPnL;
    address public owner;

    event TradeAudited(string indexed agentId, int256 pnl, string action, uint256 timestamp);
    event AgentEvolved(string indexed agentId, uint256 generation, uint256 timestamp);
    event RiskPaused(string reason, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function logTrade(
        string memory _agentId,
        string memory _action,
        uint256 _amount,
        int256 _pnl,
        string memory _lesson,
        string memory _symbol,
        string memory _errorType,
        string memory _mode
    ) public {
        TradeLog memory newLog = TradeLog({
            agentId: _agentId,
            action: _action,
            amount: _amount,
            pnl: _pnl,
            lesson: _lesson,
            symbol: _symbol,
            errorType: _errorType,
            timestamp: block.timestamp,
            trader: msg.sender,
            mode: _mode
        });

        logs.push(newLog);
        uint256 index = logs.length - 1;
        agentLogs[_agentId].push(index);
        traderLogs[msg.sender].push(index);
        
        totalTrades++;
        totalPnL += _pnl;

        emit TradeAudited(_agentId, _pnl, _action, block.timestamp);
    }

    function logEvolution(string memory _agentId, uint256 _generation) public {
        emit AgentEvolved(_agentId, _generation, block.timestamp);
    }

    function logRiskPause(string memory _reason) public {
        emit RiskPaused(_reason, block.timestamp);
    }

    // View functions
    function getLogsCount() public view returns (uint256) {
        return logs.length;
    }

    function getLogs(uint256 _start, uint256 _limit) public view returns (TradeLog[] memory) {
        require(_start < logs.length, "Start out of bounds");
        uint256 end = _start + _limit;
        if (end > logs.length) end = logs.length;
        
        TradeLog[] memory result = new TradeLog[](end - _start);
        for (uint256 i = _start; i < end; i++) {
            result[i - _start] = logs[i];
        }
        return result;
    }

    function getAgentLogs(string memory _agentId) public view returns (TradeLog[] memory) {
        uint256[] memory indices = agentLogs[_agentId];
        TradeLog[] memory result = new TradeLog[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = logs[indices[i]];
        }
        return result;
    }

    function getTraderLogs(address _trader) public view returns (TradeLog[] memory) {
        uint256[] memory indices = traderLogs[_trader];
        TradeLog[] memory result = new TradeLog[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = logs[indices[i]];
        }
        return result;
    }

    function getStats() public view returns (uint256, int256, uint256) {
        return (totalTrades, totalPnL, logs.length);
    }

    // Emergency
    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}

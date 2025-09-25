// cardHistory.js - 卡牌历史记录工具函数

/**
 * 初始化卡牌历史记录
 * @param {Object} card - 卡牌对象
 * @returns {Array} 包含初始状态的历史记录数组
 */
export const initCardHistory = (card) => {
  return [{
    timestamp: Date.now(),
    action: 'initialize',
    changes: { ...card }
  }];
};

/**
 * 记录卡牌变更历史
 * @param {Object} card - 卡牌对象
 * @param {string} action - 变更动作描述
 * @param {Object} changes - 变更的内容
 * @param {Array} history - 历史记录数组（可选，如果不提供则从卡牌中获取）
 * @returns {Object} 新的历史记录条目
 */
export const recordCardChange = (card, action, changes, history = null) => {
  const cardHistory = history || (card.history || []);
  const record = {
    timestamp: Date.now(),
    action: action,
    changes: { ...changes }
  };
  
  cardHistory.push(record);
  
  // 确保卡牌对象有history属性
  if (!card.history) {
    card.history = cardHistory;
  }
  
  return record;
};

/**
 * 获取卡牌的完整历史记录
 * @param {Object} card - 卡牌对象
 * @returns {Array} 历史记录数组
 */
export const getCardHistory = (card) => {
  return card.history || [];
};

/**
 * 获取卡牌的特定历史记录
 * @param {Object} card - 卡牌对象
 * @param {number} index - 历史记录索引
 * @returns {Object|null} 特定的历史记录条目
 */
export const getCardHistoryEntry = (card, index) => {
  const history = getCardHistory(card);
  return history[index] || null;
};
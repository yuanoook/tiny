// gameManager.js - 全局游戏管理器，用于管理所有卡牌和跟踪历史记录

import { ref, reactive } from 'vue';
import { recordCardChange } from './utils/cardHistory.js';

// 全局游戏状态
const gameState = reactive({
  cards: [], // 所有卡牌
  players: [], // 玩家列表
  history: [] // 全局历史记录
});

// 初始化游戏管理器
export const initGameManager = (initialCards, initialPlayers) => {
  gameState.cards = [...initialCards];
  gameState.players = [...initialPlayers];
  gameState.history = [];
};

// 记录全局历史
export const recordGlobalHistory = (action, details) => {
  const record = {
    timestamp: Date.now(),
    action: action,
    details: { ...details }
  };
  
  gameState.history.push(record);
  console.log('Game History:', record); // 打印历史记录到控制台
  
  return record;
};

// 移动卡牌
export const moveCard = (cardId, fromZone, toZone, additionalDetails = {}) => {
  const cardIndex = gameState.cards.findIndex(card => card.id === cardId);
  
  if (cardIndex === -1) {
    console.warn(`Card with id ${cardId} not found`);
    return null;
  }
  
  // 记录变更前的状态
  const previousState = { ...gameState.cards[cardIndex] };
  
  // 更新卡牌状态
  const updatedCard = {
    ...gameState.cards[cardIndex],
    owner: toZone.row,
    to: toZone.col || null,
    updateTime: Date.now()
  };
  
  // 更新游戏状态中的卡牌
  gameState.cards[cardIndex] = updatedCard;
  
  // 记录卡牌变更历史
  const changes = {};
  if (previousState.owner !== updatedCard.owner) {
    changes.owner = updatedCard.owner;
  }
  if (previousState.to !== updatedCard.to) {
    changes.to = updatedCard.to;
  }
  changes.updateTime = updatedCard.updateTime;
  
  recordCardChange(updatedCard, 'moveCard', changes);
  
  // 记录全局历史
  const globalDetails = {
    cardId: cardId,
    from: fromZone,
    to: toZone,
    changes: changes,
    ...additionalDetails
  };
  
  recordGlobalHistory('moveCard', globalDetails);
  
  return updatedCard;
};

// 获取游戏状态
export const getGameState = () => {
  return { ...gameState };
};

// 获取全局历史记录
export const getGlobalHistory = () => {
  return [...gameState.history];
};

// 打印历史记录
export const printHistory = () => {
  console.log('=== Global Game History ===');
  gameState.history.forEach((record, index) => {
    console.log(`${index + 1}. [${new Date(record.timestamp).toLocaleTimeString()}] ${record.action}:`, record.details);
  });
  console.log('==========================');
};

// 清空历史记录
export const clearHistory = () => {
  gameState.history = [];
  console.log('Global history cleared');
};
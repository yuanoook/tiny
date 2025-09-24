// useGameLogic.js - 游戏逻辑相关的可组合函数

import { ref, computed } from 'vue';
import { 
  initializePlayers, 
  generateInitialCards, 
  addEmptyCardsForPlayers,
  getAllZones,
  getCardsInColumnHeader,
  getCardsInRowHeader,
  getCardsInCell,
  getCardIndex,
  isCenterZone,
  handleRemovePlayerCards
} from '../gameState.js';

export function useGameLogic() {
  // 初始化玩家列表
  const players = ref(initializePlayers());
  
  // 基础区域
  const baseZones = ref([
    { id: 'deck', name: '新牌堆' },
    { id: 'discard', name: '弃牌堆' }
  ]);
  
  // 生成初始卡牌数据
  let initialCards = generateInitialCards();
  
  // 为每个玩家生成一张empty卡牌，并标记为第一个空心牌
  initialCards = addEmptyCardsForPlayers(players.value, initialCards);
  
  // 卡牌数据
  const cards = ref(initialCards);
  
  // 全局ID计数器
  const nextGlobalId = ref(61); // 初始值设为61，与现有卡牌ID不冲突
  
  // 所有区域（新牌堆 + 玩家区域 + 弃牌堆）
  const allZones = computed(() => {
    return getAllZones(baseZones.value, players.value);
  });
  
  // 获取列标题区域的卡牌（没有to属性的卡牌）
  const getCardsInColumnHeaderComputed = (zoneId) => {
    return getCardsInColumnHeader(cards.value, zoneId);
  };
  
  // 获取行标题区域的卡牌（没有to属性的卡牌）
  const getCardsInRowHeaderComputed = (zoneId) => {
    return getCardsInRowHeader(cards.value, zoneId);
  };
  
  // 获取单元格中的卡牌（有to属性的卡牌）
  const getCardsInCellComputed = (rowZoneId, colZoneId) => {
    return getCardsInCell(cards.value, rowZoneId, colZoneId);
  };
  
  // 判断是否为中心区域（工作区/待转区）
  const isCenterZoneComputed = (rowZoneId, colZoneId) => {
    return isCenterZone(rowZoneId, colZoneId);
  };
  
  // 添加玩家
  const addPlayer = () => {
    const playerId = `player${players.value.length + 1}`;
    players.value.push({ id: playerId, name: `玩家${players.value.length + 1}` });
  };
  
  // 移除玩家
  const removePlayer = (playerId) => {
    if (players.value.length > 2) {
      players.value = players.value.filter(player => player.id !== playerId);
      
      // 将该玩家的卡牌移至弃牌堆
      cards.value = handleRemovePlayerCards(cards.value, playerId);
    }
  };
  
  // 重置游戏
  const resetGame = () => {
    // 重新生成60张随机分布的卡牌
    cards.value = generateInitialCards();
  };
  
  // 获取当前全局ID值
  const getCurrentGlobalId = () => {
    return nextGlobalId.value;
  };
  
  // 手动更新全局ID值
  const updateGlobalId = (newValue) => {
    if (typeof newValue === 'number' && newValue > nextGlobalId.value) {
      nextGlobalId.value = newValue;
    }
  };
  
  // 获取卡牌在cards数组中的索引
  const getCardIndexComputed = (card) => {
    return getCardIndex(cards.value, card);
  };
  
  return {
    // 状态
    players,
    baseZones,
    cards,
    nextGlobalId,
    allZones,
    
    // 计算属性
    getCardsInColumnHeader: getCardsInColumnHeaderComputed,
    getCardsInRowHeader: getCardsInRowHeaderComputed,
    getCardsInCell: getCardsInCellComputed,
    isCenterZone: isCenterZoneComputed,
    getCardIndex: getCardIndexComputed,
    
    // 方法
    addPlayer,
    removePlayer,
    resetGame,
    getCurrentGlobalId,
    updateGlobalId
  };
}
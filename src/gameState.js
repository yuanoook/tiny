// gameState.js - 游戏状态管理模块

import { initCardHistory, recordCardChange } from './utils/cardHistory.js';

// 初始化玩家列表
const initPlayers = () => {
  return [
    { id: 'player1', name: '玩家1' },
    { id: 'player2', name: '玩家2' }
  ];
};

// 生成初始卡牌数据
const initCards = () => {
  const types = ['red', 'yellow', 'green'];
  const cards = [];
  
  // 生成60张卡牌，每种类型各20张
  for (let i = 0; i < 60; i++) {
    const typeIndex = Math.floor(i / 20); // 每20张为一种类型
    const type = types[typeIndex];
    const card = {
      id: i + 1,
      cardNo: i + 1,
      type: type,
      owner: 'deck', // 所有卡牌初始时都在新牌堆
      visibility: 'hidden',
      updateTime: Date.now() // 添加更新时间字段
    };
    
    // 添加历史记录
    card.history = initCardHistory(card);
    
    cards.push(card);
  }
  
  // Fisher-Yates 洗牌算法，将卡牌随机打散
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return cards;
};

// 为玩家生成空卡牌
const addEmptyCardsForPlayers = (players, cards) => {
  // 为每个玩家生成一张empty卡牌，并标记为第一个空心牌
  players.forEach((player, index) => {
    const card = {
      id: `empty-${player.id}`,
      cardNo: null, // 初始时没有卡牌编号
      type: 'empty',
      owner: player.id,
      visibility: 'hidden',

      isPrototype: true, // 标记为首空心牌原型
      isDisguised: true, // 默认是伪装牌
      disguiseColor: null, // 初始伪装颜色为空
      updateTime: Date.now() // 添加更新时间字段
    };
    
    // 添加历史记录
    card.history = initCardHistory(card);
    
    cards.push(card);
  });
  
  return cards;
};

// 获取所有区域（新牌堆 + 玩家区域 + 弃牌堆 + PK对战区）
const getAllZones = (baseZones, players) => {
  // 先获取新牌堆
  const deckZone = baseZones.find(zone => zone.id === 'deck');
  // 获取弃牌堆
  const discardZone = baseZones.find(zone => zone.id === 'discard');
  // 获取玩家区域
  const playerZones = players.map(player => ({ id: player.id, name: player.name }));
  
  // 添加PK对战区
  const battleZone = { id: 'battle', name: 'PK对战区' };
  
  // 返回排序后的区域：新牌堆 + 玩家区域 + 弃牌堆 + PK对战区
  return [
    deckZone,
    ...playerZones,
    discardZone,
    battleZone
  ].filter(zone => zone !== undefined);
};

// 获取列标题区域的卡牌（没有to属性的卡牌）
const getCardsInColumnHeader = (cards, zoneId) => {
  const filteredCards = cards.filter(card => 
    card.owner === zoneId && !card.to
  );
  
  // 对除新牌堆外的卡牌按updateTime排序
  if (zoneId !== 'deck') {
    return filteredCards.sort((a, b) => a.updateTime - b.updateTime);
  }
  
  return filteredCards;
};

// 获取行标题区域的卡牌（没有to属性的卡牌）
const getCardsInRowHeader = (cards, zoneId) => {
  const filteredCards = cards.filter(card => 
    card.owner === zoneId && !card.to
  );
  
  // 对除新牌堆外的卡牌按updateTime排序
  if (zoneId !== 'deck') {
    return filteredCards.sort((a, b) => a.updateTime - b.updateTime);
  }
  
  return filteredCards;
};

// 获取单元格中的卡牌（有to属性的卡牌）
const getCardsInCell = (cards, rowZoneId, colZoneId) => {
  const filteredCards = cards.filter(card => 
    card.owner === rowZoneId && card.to === colZoneId
  );
  
  return filteredCards.sort((a, b) => a.updateTime - b.updateTime);
};

// 获取卡牌在cards数组中的索引
const getCardIndex = (cards, card) => {
  return cards.findIndex(c => c.id === card.id);
};

// 判断是否为中心区域（工作区/待转区）
const isCenterZone = (rowZoneId, colZoneId) => {
  // 中心区域是所有交叉的格子
  return true;
};

// 移除玩家时处理卡牌
const handleRemovePlayerCards = (cards, playerId) => {
  return cards.map(card => {
    if (card.owner === playerId) {
      // 记录变更前的状态
      const previousState = { ...card };
      
      const updatedCard = { ...card, owner: 'discard' };
      
      // 记录变更历史
      const changes = {};
      if (previousState.owner !== updatedCard.owner) {
        changes.owner = updatedCard.owner;
      }
      
      recordCardChange(updatedCard, 'removePlayer', changes);
      
      return updatedCard;
    }
    if (card.to === playerId) {
      // 记录变更前的状态
      const previousState = { ...card };
      
      const updatedCard = { ...card, to: null };
      
      // 记录变更历史
      const changes = {};
      if (previousState.to !== updatedCard.to) {
        changes.to = updatedCard.to;
      }
      
      recordCardChange(updatedCard, 'removePlayer', changes);
      
      return updatedCard;
    }
    return card;
  });
};

// 创建新卡牌
const createNewCard = (cardNo, owner, to = null) => {
  const card = {
    id: `new-${Date.now()}`,
    cardNo: cardNo,
    type: 'empty',
    owner: owner,
    to: to,
    visibility: 'hidden',

    isDisguised: false,
    disguiseColor: null,
    isPrototype: false,
    updateTime: Date.now() // 添加更新时间字段
  };
  
  // 添加历史记录
  card.history = initCardHistory(card);
  
  return card;
};

// 创建原型空心牌
const createPrototypeEmptyCard = (owner) => {
  const card = {
    id: `empty-${owner}`,
    cardNo: null,
    type: 'empty',
    owner: owner,
    visibility: 'hidden',

    isPrototype: true,
    isDisguised: true,
    disguiseColor: null,
    updateTime: Date.now() // 添加更新时间字段
  };
  
  // 添加历史记录
  card.history = initCardHistory(card);
  
  return card;
};

// 获取新卡牌编号
// 注意：这个方法应该在实际使用中从useGameLogic中获取当前ID值
// 这里提供一个默认实现，返回当前时间戳作为临时ID
let nextCardNo = 61; // 初始值与useGameLogic中的nextGlobalId一致

const getNewCardNo = () => {
  return nextCardNo++;
};

// 移动卡牌到指定区域
const moveCardToZone = (cards, cardId, rowZoneId, colZoneId = null) => {
  return cards.map(card => {
    if (card.id === cardId) {
      // 记录变更前的状态
      const previousState = { ...card };
      
      // 更新卡牌的owner和to属性，并更新时间戳
      const updatedCard = {
        ...card,
        owner: rowZoneId,
        to: colZoneId,
        updateTime: Date.now()
      };
      
      // 记录变更历史
      const changes = {};
      if (previousState.owner !== updatedCard.owner) {
        changes.owner = updatedCard.owner;
      }
      if (previousState.to !== updatedCard.to) {
        changes.to = updatedCard.to;
      }
      changes.updateTime = updatedCard.updateTime;
      
      recordCardChange(updatedCard, 'moveCard', changes);
      
      return updatedCard;
    }
    return card;
  });
};

export {
  initPlayers,
  initCards,
  addEmptyCardsForPlayers,
  getAllZones,
  getCardsInColumnHeader,
  getCardsInRowHeader,
  getCardsInCell,
  getCardIndex,
  isCenterZone,
  handleRemovePlayerCards,
  createNewCard,
  createPrototypeEmptyCard,
  moveCardToZone,
  getNewCardNo
};
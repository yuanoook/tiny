// gameState.js - 游戏状态管理模块

// 初始化玩家列表
const initializePlayers = () => {
  return [
    { id: 'player1', name: '玩家1' },
    { id: 'player2', name: '玩家2' }
  ];
};

// 生成初始卡牌数据
const generateInitialCards = () => {
  const colors = ['red', 'yellow', 'green'];
  const cards = [];
  
  // 生成60张卡牌，每种颜色各20张
  for (let i = 0; i < 60; i++) {
    const colorIndex = Math.floor(i / 20); // 每20张为一种颜色
    const color = colors[colorIndex];
    cards.push({
      id: i + 1,
      globalId: i + 1,
      color: color,
      owner: 'deck', // 所有卡牌初始时都在新牌堆
      visibility: 'hidden'
    });
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
    cards.push({
      id: `empty-${player.id}`,
      globalId: null, // 初始时没有全局ID
      color: 'empty',
      owner: player.id,
      visibility: 'hidden',
      isEmpty: true, // 标记为empty卡牌
      isPrototype: true, // 标记为首空心牌原型
      isDisguised: true, // 默认是伪装牌
      disguiseColor: null // 初始伪装颜色为空
    });
  });
  
  return cards;
};

// 获取所有区域（新牌堆 + 玩家区域 + 弃牌堆）
const getAllZones = (baseZones, players) => {
  // 先获取新牌堆
  const deckZone = baseZones.find(zone => zone.id === 'deck');
  // 获取弃牌堆
  const discardZone = baseZones.find(zone => zone.id === 'discard');
  // 获取玩家区域
  const playerZones = players.map(player => ({ id: player.id, name: player.name }));
  
  // 返回排序后的区域：新牌堆 + 玩家区域 + 弃牌堆
  return [
    deckZone,
    ...playerZones,
    discardZone
  ].filter(zone => zone !== undefined);
};

// 获取列标题区域的卡牌（没有to属性的卡牌）
const getCardsInColumnHeader = (cards, zoneId) => {
  return cards.filter(card => 
    card.owner === zoneId && !card.to
  );
};

// 获取行标题区域的卡牌（没有to属性的卡牌）
const getCardsInRowHeader = (cards, zoneId) => {
  return cards.filter(card => 
    card.owner === zoneId && !card.to
  );
};

// 获取单元格中的卡牌（有to属性的卡牌）
const getCardsInCell = (cards, rowZoneId, colZoneId) => {
  return cards.filter(card => 
    card.owner === rowZoneId && card.to === colZoneId
  );
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
      return { ...card, owner: 'discard' };
    }
    if (card.to === playerId) {
      return { ...card, to: null };
    }
    return card;
  });
};

// 创建新卡牌
const createNewCard = (nextGlobalId, owner, to = null) => {
  return {
    id: `new-${Date.now()}`,
    globalId: nextGlobalId,
    color: 'empty',
    owner: owner,
    to: to,
    visibility: 'hidden',
    isEmpty: true,
    isDisguised: false,
    disguiseColor: null,
    isPrototype: false
  };
};

// 创建原型空心牌
const createPrototypeEmptyCard = (owner) => {
  return {
    id: `empty-${owner}`,
    globalId: null,
    color: 'empty',
    owner: owner,
    visibility: 'hidden',
    isEmpty: true,
    isPrototype: true,
    isDisguised: true,
    disguiseColor: null
  };
};

export {
  initializePlayers,
  generateInitialCards,
  addEmptyCardsForPlayers,
  getAllZones,
  getCardsInColumnHeader,
  getCardsInRowHeader,
  getCardsInCell,
  getCardIndex,
  isCenterZone,
  handleRemovePlayerCards,
  createNewCard,
  createPrototypeEmptyCard
};
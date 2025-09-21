// 卡牌状态常量
export const CARD_STATES = {
  DECK: 'deck',        // 在牌堆中
  PLAYER1: 'player1',  // 玩家1手中
  PLAYER2: 'player2',  // 玩家2手中
  DISCARD: 'discard',  // 弃牌堆
  BATTLE_ATTACK: 'battle_attack',    // 对战牌堆 - 进攻方
  BATTLE_DEFEND: 'battle_defend',    // 对战牌堆 - 防守方
  BATTLE_CHALLENGE: 'battle_challenge' // 对战牌堆 - 质疑方
};

// 卡牌可见性状态
export const CARD_VISIBILITY = {
  HIDDEN: 'hidden',   // 暗牌
  VISIBLE: 'visible'  // 明牌
};

// 游戏阶段常量
export const GAME_PHASES = {
  SETUP: 'setup',           // 准备阶段
  DRAW: 'draw',             // 抽牌阶段
  PLAY: 'play',             // 出牌阶段
  BATTLE: 'battle',         // 对战阶段
  DISCARD: 'discard',       // 弃牌阶段
  END: 'end'                // 结束阶段
};

// 胜利条件
export const WIN_CONDITIONS = {
  ALL_CARDS_PLAYED: 'all_cards_played',     // 所有卡牌都已打出
  SPECIAL_CARD_COMBINATION: 'special_combination' // 特殊卡牌组合
};

// 对战结果
export const BATTLE_RESULTS = {
  ATTACK_WINS: 'attack_wins',     // 进攻方获胜
  DEFEND_WINS: 'defend_wins',     // 防守方获胜
  CHALLENGE_WINS: 'challenge_wins' // 质疑方获胜
};

// 卡牌类型定义
const CARD_TYPES = {
  eat: { name: '吃饭卡', description: '使用此卡可以享受美食' },
  stop: { name: '停止卡', description: '使用此卡可以暂停游戏' },
  cash: { name: '现金卡', description: '使用此卡可以获得现金奖励' }
};

// 记录卡牌历史的辅助函数
function recordCardHistory(card, action, details = {}) {
  if (!card.history) {
    card.history = [];
  }
  
  card.history.push({
    timestamp: Date.now(),
    action: action,
    details: details
  });
}

// 创建卡牌对象
export function createCard(id, type) {
  const cardType = CARD_TYPES[type] || { name: type, description: '' };
  return {
    id,
    type,
    name: cardType.name,
    description: cardType.description,
    state: CARD_STATES.DECK,      // 初始状态在牌堆中
    visibility: CARD_VISIBILITY.HIDDEN, // 初始为暗牌
    owner: null,                  // 拥有者 (player1, player2, 或 null)
    isSelected: false,            // 是否被选中
    history: []                   // 卡牌历史记录
  };
}

// 初始化游戏卡牌
export function initializeGameCards() {
  return [
    createCard(1, 'eat'),
    createCard(2, 'stop'),
    createCard(3, 'cash'),
    createCard(4, 'eat'),
    createCard(5, 'stop'),
    createCard(6, 'cash'),
    createCard(7, 'eat'),
    createCard(8, 'stop'),
    createCard(9, 'cash')
  ];
}

// 游戏状态管理类
export class GameState {
  constructor() {
    this.cards = initializeGameCards();
    this.players = {
      player1: [],
      player2: []
    };
    this.discardPile = [];
    // 对战牌堆
    this.battlePiles = {
      attack: [],      // 进攻方牌堆
      defend: [],      // 防守方牌堆
      challenge: []    // 质疑方牌堆
    };
    this.currentPlayer = 'player1';
    this.currentPhase = GAME_PHASES.SETUP;  // 当前游戏阶段
    this.gameOver = false;                  // 游戏是否结束
    this.winner = null;                     // 获胜玩家
    this.currentBattle = null;              // 当前对战信息
  }

  // 开始游戏
  startGame() {
    this.currentPhase = GAME_PHASES.DRAW;
    // 记录游戏开始历史
    this.cards.forEach(card => {
      recordCardHistory(card, 'game_start', { phase: GAME_PHASES.DRAW });
    });
    // 可以在这里添加初始发牌逻辑
    console.log('游戏开始！');
  }

  // 进入抽牌阶段
  enterDrawPhase() {
    this.currentPhase = GAME_PHASES.DRAW;
    console.log(`${this.currentPlayer} 的抽牌阶段`);
  }

  // 进入出牌阶段
  enterPlayPhase() {
    this.currentPhase = GAME_PHASES.PLAY;
    console.log(`${this.currentPlayer} 的出牌阶段`);
  }

  // 进入对战阶段
  enterBattlePhase() {
    this.currentPhase = GAME_PHASES.BATTLE;
    console.log('进入对战阶段');
  }

  // 进入弃牌阶段
  enterDiscardPhase() {
    this.currentPhase = GAME_PHASES.DISCARD;
    console.log(`${this.currentPlayer} 的弃牌阶段`);
  }

  // 结束当前玩家回合
  endTurn() {
    // 检查是否满足胜利条件
    if (this.checkWinCondition()) {
      this.endGame();
      return;
    }
    
    // 切换到下一个玩家
    this.switchPlayer();
    
    // 进入下一个玩家的抽牌阶段
    this.enterDrawPhase();
  }

  // 发牌给玩家
  dealCardToPlayer(cardId, playerId) {
    const card = this.cards.find(c => c.id === cardId);
    if (card && (playerId === 'player1' || playerId === 'player2')) {
      const oldState = card.state;
      const oldOwner = card.owner;
      
      card.state = CARD_STATES[playerId.toUpperCase()];
      card.owner = playerId;
      this.players[playerId].push(cardId);
      
      // 记录历史
      recordCardHistory(card, 'deal_to_player', {
        fromState: oldState,
        toState: card.state,
        fromOwner: oldOwner,
        toOwner: playerId
      });
      
      return true;
    }
    return false;
  }

  // 玩家抽牌
  drawCard(playerId) {
    // 移除阶段检查，允许在任何阶段抽牌
    // 从牌堆中取出一张牌
    const deckCards = this.getCardsByState(CARD_STATES.DECK);
    if (deckCards.length > 0) {
      const card = deckCards[0];
      const result = this.dealCardToPlayer(card.id, playerId);
      
      // 检查当前玩家的手牌数量，如果达到一定数量则自动进入出牌阶段
      // 例如：如果玩家手牌达到3张，则自动进入出牌阶段
      if (result && this.getPlayerCards(playerId).length >= 3) {
        this.enterPlayPhase();
      }
      
      return result;
    }
    return false;
  }

  // 玩家出牌到对战牌堆
  moveCardToBattle(cardId, playerId, battleRole) {
    // 移除阶段检查，允许在任何阶段移动卡牌到对战区域
    
    const card = this.cards.find(c => c.id === cardId);
    if (!card) {
      console.warn('找不到指定的卡牌');
      return false;
    }
    
    // 如果卡牌有所有者，检查是否属于当前玩家
    if (card.owner && card.owner !== playerId) {
      console.warn('卡牌不属于当前玩家');
      return false;
    }
    
    const oldState = card.state;
    const oldOwner = card.owner;
    
    // 根据角色设置卡牌状态
    let newState;
    switch (battleRole) {
      case 'attack':
        newState = CARD_STATES.BATTLE_ATTACK;
        card.state = newState;
        this.battlePiles.attack.push(cardId);
        break;
      case 'defend':
        newState = CARD_STATES.BATTLE_DEFEND;
        card.state = newState;
        this.battlePiles.defend.push(cardId);
        break;
      case 'challenge':
        newState = CARD_STATES.BATTLE_CHALLENGE;
        card.state = newState;
        this.battlePiles.challenge.push(cardId);
        break;
      default:
        console.warn('无效的对战角色');
        return false;
    }
    
    // 如果卡牌之前有所有者，从其手中移除
    if (oldOwner) {
      this.players[oldOwner] = this.players[oldOwner].filter(id => id !== cardId);
    }
    
    // 更新卡牌所有者为null（对战区域中的卡牌不属于任何玩家）
    card.owner = null;
    card.isSelected = false;
    
    // 记录历史
    recordCardHistory(card, 'move_to_battle', {
      fromState: oldState,
      toState: newState,
      fromOwner: oldOwner,
      toOwner: null,
      battleRole: battleRole
    });
    
    return true;
  }

  // 玩家出牌到弃牌堆
  moveCardToDiscard(cardId, playerId) {
    // 移除阶段检查，允许在任何阶段移动卡牌到弃牌堆
    
    const card = this.cards.find(c => c.id === cardId);
    if (!card) {
      console.warn('找不到指定的卡牌');
      return false;
    }
    
    const oldState = card.state;
    const oldOwner = card.owner;
    
    card.state = CARD_STATES.DISCARD;
    card.owner = null;
    card.isSelected = false; // 移动时取消选中状态
    
    // 从原来的区域移除卡牌
    switch (oldState) {
      case CARD_STATES.PLAYER1:
        this.players.player1 = this.players.player1.filter(id => id !== cardId);
        break;
      case CARD_STATES.PLAYER2:
        this.players.player2 = this.players.player2.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_ATTACK:
        this.battlePiles.attack = this.battlePiles.attack.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_DEFEND:
        this.battlePiles.defend = this.battlePiles.defend.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_CHALLENGE:
        this.battlePiles.challenge = this.battlePiles.challenge.filter(id => id !== cardId);
        break;
    }
    
    // 添加到弃牌堆
    this.discardPile.push(cardId);
    
    // 记录历史
    recordCardHistory(card, 'move_to_discard', {
      fromState: oldState,
      toState: CARD_STATES.DISCARD,
      fromOwner: oldOwner,
      toOwner: null
    });
    
    return true;
  }

  // 将卡牌移回玩家手中
  moveCardToPlayer(cardId, playerId) {
    const card = this.cards.find(c => c.id === cardId);
    if (!card) {
      console.warn('找不到指定的卡牌');
      return false;
    }
    
    const oldState = card.state;
    const oldOwner = card.owner;
    
    card.state = CARD_STATES[playerId.toUpperCase()];
    card.owner = playerId;
    card.isSelected = false; // 移动时取消选中状态
    
    // 从原来的区域移除卡牌
    switch (oldState) {
      case CARD_STATES.PLAYER1:
        this.players.player1 = this.players.player1.filter(id => id !== cardId);
        break;
      case CARD_STATES.PLAYER2:
        this.players.player2 = this.players.player2.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_ATTACK:
        this.battlePiles.attack = this.battlePiles.attack.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_DEFEND:
        this.battlePiles.defend = this.battlePiles.defend.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_CHALLENGE:
        this.battlePiles.challenge = this.battlePiles.challenge.filter(id => id !== cardId);
        break;
      case CARD_STATES.DISCARD:
        this.discardPile = this.discardPile.filter(id => id !== cardId);
        break;
    }
    
    // 添加到玩家手中
    this.players[playerId].push(cardId);
    
    // 记录历史
    recordCardHistory(card, 'move_to_player', {
      fromState: oldState,
      toState: card.state,
      fromOwner: oldOwner,
      toOwner: playerId
    });
    
    return true;
  }

  // 将卡牌移回牌堆
  moveCardToDeck(cardId) {
    const card = this.cards.find(c => c.id === cardId);
    if (!card) {
      console.warn('找不到指定的卡牌');
      return false;
    }
    
    const oldState = card.state;
    const oldOwner = card.owner;
    
    card.state = CARD_STATES.DECK;
    card.owner = null;
    card.isSelected = false; // 移动时取消选中状态
    
    // 从原来的区域移除卡牌
    switch (oldState) {
      case CARD_STATES.PLAYER1:
        this.players.player1 = this.players.player1.filter(id => id !== cardId);
        break;
      case CARD_STATES.PLAYER2:
        this.players.player2 = this.players.player2.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_ATTACK:
        this.battlePiles.attack = this.battlePiles.attack.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_DEFEND:
        this.battlePiles.defend = this.battlePiles.defend.filter(id => id !== cardId);
        break;
      case CARD_STATES.BATTLE_CHALLENGE:
        this.battlePiles.challenge = this.battlePiles.challenge.filter(id => id !== cardId);
        break;
      case CARD_STATES.DISCARD:
        this.discardPile = this.discardPile.filter(id => id !== cardId);
        break;
    }
    
    // 记录历史
    recordCardHistory(card, 'move_to_deck', {
      fromState: oldState,
      toState: CARD_STATES.DECK,
      fromOwner: oldOwner,
      toOwner: null
    });
    
    return true;
  }

  // 玩家弃牌
  discardCard(cardId, playerId) {
    if (this.currentPhase !== GAME_PHASES.DISCARD) {
      console.warn('当前不是弃牌阶段');
      return false;
    }
    
    const card = this.cards.find(c => c.id === cardId);
    if (card && card.owner === playerId) {
      const oldState = card.state;
      const oldOwner = card.owner;
      
      card.state = CARD_STATES.DISCARD;
      card.owner = null;
      card.isSelected = false;
      
      // 从弃牌堆和玩家手中移除
      this.discardPile.push(cardId);
      this.players[playerId] = this.players[playerId].filter(id => id !== cardId);
      
      // 记录历史
      recordCardHistory(card, 'discard', {
        fromState: oldState,
        toState: CARD_STATES.DISCARD,
        fromOwner: oldOwner,
        toOwner: null
      });
      
      return true;
    }
    return false;
  }

  // 开始对战
  startBattle(attackerId) {
    this.currentBattle = {
      attacker: attackerId,
      defender: attackerId === 'player1' ? 'player2' : 'player1',
      challenger: null,  // 质疑者可以是任意玩家
      startTime: Date.now()
    };
    this.enterBattlePhase();
  }

  // 解决对战
  resolveBattle() {
    if (!this.currentBattle) {
      console.warn('没有正在进行的对战');
      return null;
    }
    
    // 简单的对战解决逻辑（实际游戏中可以根据卡牌类型和数量来决定）
    const attackCards = this.getCardsByState(CARD_STATES.BATTLE_ATTACK);
    const defendCards = this.getCardsByState(CARD_STATES.BATTLE_DEFEND);
    const challengeCards = this.getCardsByState(CARD_STATES.BATTLE_CHALLENGE);
    
    let result;
    
    // 如果有质疑卡牌，则质疑方获胜
    if (challengeCards.length > 0) {
      result = BATTLE_RESULTS.CHALLENGE_WINS;
    }
    // 如果防守方有卡牌且进攻方没有，则防守方获胜
    else if (defendCards.length > 0 && attackCards.length === 0) {
      result = BATTLE_RESULTS.DEFEND_WINS;
    }
    // 如果进攻方有卡牌且防守方没有，则进攻方获胜
    else if (attackCards.length > 0 && defendCards.length === 0) {
      result = BATTLE_RESULTS.ATTACK_WINS;
    }
    // 默认情况下进攻方获胜
    else {
      result = BATTLE_RESULTS.ATTACK_WINS;
    }
    
    // 将对战牌堆中的卡牌移到弃牌堆
    this.battlePiles.attack.forEach(cardId => {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        const oldState = card.state;
        card.state = CARD_STATES.DISCARD;
        this.discardPile.push(cardId);
        
        // 记录历史
        recordCardHistory(card, 'battle_resolved', {
          fromState: oldState,
          toState: CARD_STATES.DISCARD,
          result: result,
          battleType: 'attack'
        });
      }
    });
    
    this.battlePiles.defend.forEach(cardId => {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        const oldState = card.state;
        card.state = CARD_STATES.DISCARD;
        this.discardPile.push(cardId);
        
        // 记录历史
        recordCardHistory(card, 'battle_resolved', {
          fromState: oldState,
          toState: CARD_STATES.DISCARD,
          result: result,
          battleType: 'defend'
        });
      }
    });
    
    this.battlePiles.challenge.forEach(cardId => {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        const oldState = card.state;
        card.state = CARD_STATES.DISCARD;
        this.discardPile.push(cardId);
        
        // 记录历史
        recordCardHistory(card, 'battle_resolved', {
          fromState: oldState,
          toState: CARD_STATES.DISCARD,
          result: result,
          battleType: 'challenge'
        });
      }
    });
    
    // 清空对战牌堆
    this.battlePiles.attack = [];
    this.battlePiles.defend = [];
    this.battlePiles.challenge = [];
    
    // 清除当前对战
    this.currentBattle = null;
    
    return result;
  }

  // 选择卡牌
  selectCard(cardId) {
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
      // 先取消所有卡牌的选中状态
      this.cards.forEach(c => {
        if (c.isSelected) {
          recordCardHistory(c, 'deselect');
          c.isSelected = false;
        }
      });
      
      // 选中指定卡牌
      card.isSelected = true;
      recordCardHistory(card, 'select');
      
      return true;
    }
    return false;
  }

  // 取消选择卡牌
  deselectCard(cardId) {
    const card = this.cards.find(c => c.id === cardId);
    if (card && card.isSelected) {
      card.isSelected = false;
      recordCardHistory(card, 'deselect');
      return true;
    }
    return false;
  }

  // 取消所有卡牌的选中状态
  deselectAllCards() {
    this.cards.forEach(card => {
      if (card.isSelected) {
        card.isSelected = false;
        recordCardHistory(card, 'deselect');
      }
    });
  }

  // 设置卡牌可见性
  setCardVisibility(cardId, visibility) {
    const card = this.cards.find(c => c.id === cardId);
    if (card && (visibility === CARD_VISIBILITY.HIDDEN || visibility === CARD_VISIBILITY.VISIBLE)) {
      const oldVisibility = card.visibility;
      card.visibility = visibility;
      
      // 记录历史
      recordCardHistory(card, 'visibility_change', {
        fromVisibility: oldVisibility,
        toVisibility: visibility
      });
      
      return true;
    }
    return false;
  }

  // 获取指定状态的卡牌
  getCardsByState(state) {
    return this.cards.filter(card => card.state === state);
  }

  // 获取玩家手牌
  getPlayerCards(playerId) {
    return this.cards.filter(card => card.owner === playerId);
  }

  // 获取选中的卡牌
  getSelectedCard() {
    return this.cards.find(card => card.isSelected);
  }

  // 获取对战牌堆中的卡牌
  getBattleCards(role) {
    switch (role) {
      case 'attack':
        return this.cards.filter(card => card.state === CARD_STATES.BATTLE_ATTACK);
      case 'defend':
        return this.cards.filter(card => card.state === CARD_STATES.BATTLE_DEFEND);
      case 'challenge':
        return this.cards.filter(card => card.state === CARD_STATES.BATTLE_CHALLENGE);
      default:
        return [];
    }
  }

  // 切换当前玩家
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  // 检查胜利条件
  checkWinCondition() {
    // 示例胜利条件：所有卡牌都已打出
    const playedCards = this.getCardsByState(CARD_STATES.DISCARD);
    return playedCards.length === this.cards.length;
  }

  // 结束游戏
  endGame() {
    this.currentPhase = GAME_PHASES.END;
    this.gameOver = true;
    
    // 确定获胜者（这里简单地以当前玩家为获胜者）
    this.winner = this.currentPlayer;
    
    console.log(`游戏结束！${this.winner} 获胜！`);
  }

  // 重新开始游戏
  restartGame() {
    this.cards = initializeGameCards();
    this.players = {
      player1: [],
      player2: []
    };
    this.discardPile = [];
    this.battlePiles = {
      attack: [],
      defend: [],
      challenge: []
    };
    this.currentPlayer = 'player1';
    this.currentPhase = GAME_PHASES.SETUP;
    this.gameOver = false;
    this.winner = null;
    this.currentBattle = null;
  }

  // 获取当前游戏阶段
  getCurrentPhase() {
    return this.currentPhase;
  }

  // 获取游戏状态信息
  getGameStatus() {
    return {
      currentPlayer: this.currentPlayer,
      currentPhase: this.currentPhase,
      gameOver: this.gameOver,
      winner: this.winner,
      deckCount: this.getCardsByState(CARD_STATES.DECK).length,
      discardCount: this.getCardsByState(CARD_STATES.DISCARD).length,
      player1Count: this.getPlayerCards('player1').length,
      player2Count: this.getPlayerCards('player2').length,
      battleAttackCount: this.getCardsByState(CARD_STATES.BATTLE_ATTACK).length,
      battleDefendCount: this.getCardsByState(CARD_STATES.BATTLE_DEFEND).length,
      battleChallengeCount: this.getCardsByState(CARD_STATES.BATTLE_CHALLENGE).length
    };
  }
}

// 创建全局游戏状态实例
export const gameState = new GameState();
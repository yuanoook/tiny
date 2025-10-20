// cardUtils.js - 卡牌相关的工具函数

/**
 * 检查卡牌是否为黄色类型或伪装成黄色类型
 * @param {Object} card - 卡牌对象
 * @returns {boolean} - 如果卡牌是黄色类型或伪装成黄色类型则返回true，否则返回false
 */
export function isYellowCard(card) {
  // 如果卡牌是伪装的，检查伪装颜色是否为黄色
  if (card.isDisguised && card.disguiseColor) {
    return card.disguiseColor === 'yellow';
  }
  
  // 如果卡牌不是伪装的，检查实际类型是否为黄色
  return card.type === 'yellow';
}

/**
 * 检查卡牌是否为红色类型或伪装成红色类型
 * @param {Object} card - 卡牌对象
 * @returns {boolean} - 如果卡牌是红色类型或伪装成红色类型则返回true，否则返回false
 */
export function isRedCard(card) {
  // 如果卡牌是伪装的，检查伪装颜色是否为红色
  if (card.isDisguised && card.disguiseColor) {
    return card.disguiseColor === 'red';
  }
  
  // 如果卡牌不是伪装的，检查实际类型是否为红色
  return card.type === 'red';
}

/**
 * 检查卡牌是否为绿色类型或伪装成绿色类型
 * @param {Object} card - 卡牌对象
 * @returns {boolean} - 如果卡牌是绿色类型或伪装成绿色类型则返回true，否则返回false
 */
export function isGreenCard(card) {
  // 如果卡牌是伪装的，检查伪装颜色是否为绿色
  if (card.isDisguised && card.disguiseColor) {
    return card.disguiseColor === 'green';
  }
  
  // 如果卡牌不是伪装的，检查实际类型是否为绿色
  return card.type === 'green';
}
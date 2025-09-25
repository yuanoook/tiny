// useCardOperations.js - 卡片操作相关的可组合函数

import { ref } from 'vue';
import { recordCardChange } from '../utils/cardHistory.js';

export function useCardOperations() {
  // 弹窗状态
  const showCardModal = ref(false);
  const currentCard = ref(null);
  
  // 显示卡牌操作弹窗
  const toggleCardDisguise = (card) => {
    currentCard.value = card;
    showCardModal.value = true;
  };
  
  // 切换卡牌明暗状态
  const toggleCardVisibility = () => {
    if (currentCard.value) {
      // 记录变更前的状态
      const previousState = { ...currentCard.value };
      
      // 切换卡牌的可见性
      if (currentCard.value.visibility === 'hidden') {
        // 如果是暗牌，变为明牌
        delete currentCard.value.visibility;
        // 如果之前是伪装牌，取消伪装
        if (currentCard.value.isDisguised) {
          delete currentCard.value.isDisguised;
          delete currentCard.value.disguiseColor;
        }
      } else {
        // 如果是明牌，变为暗牌
        currentCard.value.visibility = 'hidden';
        // 取消伪装状态
        if (currentCard.value.isDisguised) {
          delete currentCard.value.isDisguised;
          delete currentCard.value.disguiseColor;
        }
      }
      
      // 记录变更历史
      const changes = {};
      if (previousState.visibility !== currentCard.value.visibility) {
        changes.visibility = currentCard.value.visibility;
      }
      if (previousState.isDisguised !== currentCard.value.isDisguised) {
        changes.isDisguised = currentCard.value.isDisguised;
      }
      if (previousState.disguiseColor !== currentCard.value.disguiseColor) {
        changes.disguiseColor = currentCard.value.disguiseColor;
      }
      
      recordCardChange(currentCard.value, 'toggleVisibility', changes);
      
      showCardModal.value = false;
    }
  };
  
  // 设置卡牌伪装颜色
  const setDisguiseColor = (color) => {
    if (currentCard.value) {
      // 记录变更前的状态
      const previousState = { ...currentCard.value };
      
      // 如果是empty卡牌且还没有设置伪装颜色，则设置伪装颜色
      if (currentCard.value.isEmpty && !currentCard.value.disguiseColor) {
        currentCard.value.disguiseColor = color;
        currentCard.value.isDisguised = true; // 确保设置为伪装状态
      }
      // 如果卡牌已经是该颜色的伪装，则取消伪装
      else if (currentCard.value.isDisguised && currentCard.value.disguiseColor === color) {
        currentCard.value.isDisguised = false;
        currentCard.value.disguiseColor = null;
      } else {
        // 设置新的伪装颜色
        currentCard.value.isDisguised = true;
        currentCard.value.disguiseColor = color;
        // 如果是明牌，变为暗牌以保持伪装状态
        if (!currentCard.value.visibility) {
          currentCard.value.visibility = 'hidden';
        }
      }
      
      // 记录变更历史
      const changes = {};
      if (previousState.isDisguised !== currentCard.value.isDisguised) {
        changes.isDisguised = currentCard.value.isDisguised;
      }
      if (previousState.disguiseColor !== currentCard.value.disguiseColor) {
        changes.disguiseColor = currentCard.value.disguiseColor;
      }
      if (previousState.visibility !== currentCard.value.visibility) {
        changes.visibility = currentCard.value.visibility;
      }
      
      recordCardChange(currentCard.value, 'setDisguiseColor', changes);
      
      showCardModal.value = false;
    }
  };
  
  return {
    // 状态
    showCardModal,
    currentCard,
    
    // 方法
    toggleCardDisguise,
    toggleCardVisibility,
    setDisguiseColor
  };
}
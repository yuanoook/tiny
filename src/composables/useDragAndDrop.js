// useDragAndDrop.js - 拖拽相关的可组合函数

import { ref, computed } from 'vue';
import { createNewCard, moveCardToZone, getNewCardNo } from '../gameState.js';
import { recordGlobalHistory } from '../gameManager.js';

export function useDragAndDrop(cards) {
  // 拖拽状态
  const draggingCard = ref(null);
  const originalDraggingCard = ref(null);
  const dragImage = ref(null);
  const dragOffsetX = ref(0);
  const dragOffsetY = ref(0);
  const dragX = ref(0);
  const dragY = ref(0);

  // 处理拖拽开始
  const handleDragStart = (card, event) => {
    // 如果是原型空心牌，则创建一个新的卡牌实例
    if (card.isPrototype) {
      // 创建新卡牌，继承原始卡牌的部分属性
      const newCard = {
        ...card,
        id: `drag-${Date.now()}`, // 为拖拽中的卡牌创建唯一ID
        isPrototype: false, // 拖拽中的卡牌不是原型
        // 重置拖拽相关属性
        owner: card.owner,
        to: null,
        visibility: 'hidden',
        type: card.isDisguised ? card.disguiseColor : 'empty',
        isDisguised: card.isDisguised || false,
        disguiseColor: card.disguiseColor || null
      };
      
      // 如果原型卡牌设置了伪装，确保新卡牌也保持伪装状态
      if (card.isDisguised && card.disguiseColor) {
        newCard.isDisguised = true;
        newCard.disguiseColor = card.disguiseColor;
        newCard.type = card.disguiseColor;
      }
      
      originalDraggingCard.value = card; // 保存原始卡牌引用
      draggingCard.value = newCard; // 设置拖拽中的卡牌
    } else {
      originalDraggingCard.value = null; // 非原型卡牌不需要保存原始引用
      draggingCard.value = card; // 直接使用原卡牌作为拖拽卡牌
    }

    // 计算鼠标相对于卡牌左上角的偏移量
    const rect = event.target.getBoundingClientRect();
    dragOffsetX.value = event.clientX - rect.left;
    dragOffsetY.value = event.clientY - rect.top + 5;
    
    // 添加鼠标移动事件监听器
    document.addEventListener('mousemove', handleDocumentDragOver);
  };

  // 处理文档拖拽移动
  const handleDocumentDragOver = (event) => {
    // 更新拖拽卡牌的位置，保持鼠标相对于卡牌的偏移量不变
    dragX.value = event.clientX - dragOffsetX.value;
    dragY.value = event.clientY - dragOffsetY.value;
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    draggingCard.value = null;
    
    // 移除鼠标移动事件监听器
    document.removeEventListener('mousemove', handleDocumentDragOver);
  };

  // 处理拖拽经过
  const handleDragOver = (event) => {
    event.preventDefault();
    handleDocumentDragOver(event);
  };

  // 处理放置操作的公共逻辑
  const handleDropCommon = (targetZoneId, targetColZoneId, cards, isHeaderDrop = false) => {
    // 阻止默认行为
    event.preventDefault();
    
    if (draggingCard.value) {
      // 保存原始拖拽卡牌的引用
      const originalCard = originalDraggingCard.value || draggingCard.value;
      
      // 只有原型空心牌才能创建新卡牌
      if (originalCard.isPrototype) {
        // 获取新卡牌编号
        const cardNo = getNewCardNo();
        const newCard = createNewCard(cardNo, targetZoneId, targetColZoneId);
        
        // 如果原型卡牌设置了伪装，确保新卡牌也保持伪装状态
        if (originalCard.isDisguised && originalCard.disguiseColor) {
          newCard.isDisguised = true;
          newCard.disguiseColor = originalCard.disguiseColor;
        }
        
        // 添加新卡牌到cards数组
        cards.push(newCard);
        
        // 记录全局历史
        recordGlobalHistory('createCard', {
          cardId: newCard.id,
          cardNo: cardNo,
          owner: targetZoneId,
          to: targetColZoneId
        });
      } else {
        // 对于非原型卡牌，使用moveCardToZone获取更新后的数组并替换原数组
        const updatedCards = moveCardToZone(cards, draggingCard.value.id, targetZoneId, targetColZoneId);
        
        // 使用splice和展开运算符来替换整个cards数组，确保Vue能检测到变化
        cards.splice(0, cards.length, ...updatedCards);
        
        // 记录全局历史
        const from = { row: draggingCard.value.owner, col: draggingCard.value.to };
        const to = { row: targetZoneId, col: targetColZoneId };
        
        recordGlobalHistory('moveCard', {
          cardId: draggingCard.value.id,
          from,
          to
        });
      }
      
      // 重置拖拽状态
      draggingCard.value = null;
      originalDraggingCard.value = null;
      
      // 移除鼠标移动事件监听器
      document.removeEventListener('mousemove', handleDocumentDragOver);
    }
  };

  // 处理放置到单元格
  const handleDrop = (rowZoneId, colZoneId, cards) => {
    handleDropCommon(rowZoneId, colZoneId, cards, false);
  };

  // 处理放置到表头
  const handleDropToHeader = (zoneId, cards) => {
    handleDropCommon(zoneId, null, cards, true);
  };

    // 计算拖拽卡牌的样式
  const draggingCardStyle = computed(() => {
    if (!draggingCard.value) return {};
    return {
      position: 'fixed',
      left: `${dragX.value}px`,
      top: `${dragY.value}px`,
      pointerEvents: 'none',
      zIndex: 1000
    };
  });

  // 判断卡牌是否正在被拖拽
  const isDragging = (card) => {
    // 如果有正在拖拽的卡牌，直接比较ID
    if (draggingCard.value && draggingCard.value.id === card.id) {
      return true;
    }
    
    // 如果是原型卡牌，还需要检查是否是原始拖拽卡牌
    if (card.isPrototype && originalDraggingCard.value && originalDraggingCard.value.id === card.id) {
      return true;
    }
    
    return false;
  };

  return {
    // 状态
    draggingCard,
    originalDraggingCard,
    dragImage,
    dragOffsetX,
    dragOffsetY,
    dragX,
    dragY,
    draggingCardStyle,
    
    // 方法
    handleDragStart,
    handleDocumentDragOver,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDropToHeader,
    isDragging
  };
}
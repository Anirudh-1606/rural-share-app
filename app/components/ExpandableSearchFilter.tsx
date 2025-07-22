import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateRangeCalendar from './DateRangeCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange, clearDateRange } from '../store/slices/dateRangeSlice';
import { RootState } from '../store';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExpandableSearchFilter({ onToggleExpand }: { onToggleExpand: (expanded: boolean, contentHeight: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.dateRange);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    // Pass the expanded state and content height to the parent
    if (onToggleExpand) {
      onToggleExpand(newExpandedState, contentHeight);
    }
  };

  const handleContentLayout = (event: any) => {
    // Only set content height if it's not already set or if it changes
    if (contentHeight === 0 || contentHeight !== event.nativeEvent.layout.height) {
      setContentHeight(event.nativeEvent.layout.height);
    }
  };

  const handleConfirmDate = (start: string, end: string) => {
    dispatch(setDateRange({ startDate: start, endDate: end }));
    toggleExpand();
  };

  const handleClearDate = () => {
    dispatch(clearDateRange());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.headerTextContainer}>
          {startDate && endDate && <View style={styles.dot} />}
          <Text weight="semibold" color={COLORS.TEXT.INVERSE} style={styles.immediateButton}>
            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Immediate'}
          </Text>
        </View>
        <Ionicons name= {expanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.TEXT.INVERSE} />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content} onLayout={handleContentLayout}>
          <DateRangeCalendar 
            onConfirm={handleConfirmDate} 
            initialStartDate={startDate || undefined}
            initialEndDate={endDate || undefined}
          />
          <TouchableOpacity style={styles.immediateButton} onPress={handleClearDate}>
            <Text color={COLORS.TEXT.INVERSE}>Set to Immediate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    overflow: 'hidden',
    marginHorizontal: SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.WHITE,
    fontSize: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.XS,
  },
  content: {
    backgroundColor: 'transparent',
    padding: SPACING.SM,
  },
  immediateButton: {
    alignItems: 'center',
    marginTop: SPACING.SM,
    backgroundColor: 'transparent',
  },
});
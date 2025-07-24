import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, Animated } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateRangeCalendar from './DateRangeCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange, clearDateRange } from '../store/slices/dateRangeSlice';
import { RootState } from '../store';




export default function ExpandableSearchFilter({ onToggleExpand }: { onToggleExpand: (expanded: boolean, contentHeight: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.dateRange);
  const dotAnimation = useRef(new Animated.Value(0)).current;
  const isMeasured = contentHeight > 0;

  useEffect(() => {
    if (!startDate || !endDate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(dotAnimation, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      dotAnimation.setValue(1); // Keep dot solid when a date is selected
    }
  }, [startDate, endDate, dotAnimation]);

  const toggleExpand = () => {
    if (!isMeasured) return;

    const newExpandedState = !expanded;
    setExpanded(newExpandedState);

    if (newExpandedState) {
      Animated.sequence([
        Animated.timing(animatedHeight, { toValue: contentHeight, duration: 300, useNativeDriver: false }),
        Animated.timing(contentOpacityAnim, { toValue: 1, duration: 200, delay: 100, useNativeDriver: true }),
      ]).start(() => onToggleExpand(true, contentHeight));
    } else {
      Animated.sequence([
        Animated.timing(contentOpacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(animatedHeight, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start(() => onToggleExpand(false, 0));
    }
  };

  const handleConfirmDate = (start: string, end: string) => {
    dispatch(setDateRange({ startDate: start, endDate: end }));
    if (expanded) {
      toggleExpand();
    }
  };

  const handleClearDate = () => {
    dispatch(clearDateRange());
    if (expanded) {
      toggleExpand();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderContent = () => (
    <>
      <DateRangeCalendar 
        onConfirm={handleConfirmDate} 
        initialStartDate={startDate || undefined}
        initialEndDate={endDate || undefined}
      />
      <TouchableOpacity style={styles.immediateButton} onPress={handleClearDate}>
        <Text color={COLORS.TEXT.INVERSE}>Set to Immediate</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.headerTextContainer}>
          <Animated.View style={[styles.flashingDot, { opacity: dotAnimation }]} />
          <Text weight="medium" color={COLORS.TEXT.INVERSE} style={styles.headerText}>
            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Immediate'}
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.TEXT.INVERSE} />
      </TouchableOpacity>
      
      <Animated.View style={[styles.content, { height: animatedHeight }]}>
        <Animated.View style={[{ opacity: contentOpacityAnim }]}>
          {isMeasured && renderContent()}
        </Animated.View>
      </Animated.View>

      {!isMeasured && (
        <View style={styles.hiddenContainer} pointerEvents="none">
          <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
            {renderContent()}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING['XL'],
    marginBottom: SPACING.SM,
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
    color: COLORS.TEXT.INVERSE,
    fontSize: 16,
  },
  flashingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.SECONDARY.LIGHT,
    marginRight: SPACING.XS,
  },
  content: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  immediateButton: {
    alignItems: 'center',
    marginTop: SPACING.SM,
    backgroundColor: 'transparent',
  },
  hiddenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
  },
});

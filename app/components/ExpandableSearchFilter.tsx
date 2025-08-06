import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, Animated } from 'react-native';
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

export default function ExpandableSearchFilter({ onHeightChange }) {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.date);

  const handleConfirmDate = (start: string, end: string) => {
    dispatch(setDateRange({ startDate: start, endDate: end }));
  };

  const handleClearDate = () => {
    dispatch(clearDateRange());
  };

  const renderContent = () => (
    <>
      <DateRangeCalendar 
        onConfirm={handleConfirmDate} 
        initialStartDate={startDate || undefined}
        initialEndDate={endDate || undefined}
      />
      <TouchableOpacity style={styles.immediateButton} onPress={handleClearDate}>
        <Text color={COLORS.TEXT.INVERSE}>Reset Date</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container} onLayout={(event) => onHeightChange(event.nativeEvent.layout.height)}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD, // Add this line
    marginHorizontal: SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING['2XL'],
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.TEXT.INVERSE,
    fontSize: 16,
  },
  content: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginTop: SPACING.SM,
  },
  immediateButton: {
    alignItems: 'center',
    marginTop: SPACING.SM,
    // marginBottom: SPACING.SM,
    backgroundColor: 'transparent',
  },
});
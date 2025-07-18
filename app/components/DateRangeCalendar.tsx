
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils';
import Text from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DateRangeCalendarProps {
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function DateRangeCalendar({ onConfirm, initialStartDate, initialEndDate }: DateRangeCalendarProps) {
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');

  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      let dates = {};
      let currentDate = new Date(initialStartDate);
      const stopDate = new Date(initialEndDate);

      while (currentDate <= stopDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        dates[dateString] = { color: COLORS.PRIMARY.LIGHT, textColor: 'white' };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setMarkedDates({
        ...dates,
        [initialStartDate]: { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
        [initialEndDate]: { endingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
      });
    }
  }, [initialStartDate, initialEndDate]);

  const onDayPress = (day: any) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    if (selectedDate < today) {
      // Don't allow selecting past dates
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day.dateString);
      setEndDate('');
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
      });
    } else if (startDate && !endDate) {
      // End selection
      const newEndDate = day.dateString;

      if (new Date(newEndDate) < new Date(startDate)) {
        // Don't allow selecting an end date before the start date
        setStartDate(day.dateString);
        setEndDate('');
        setMarkedDates({
          [day.dateString]: { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
        });
        return;
      }

      setEndDate(newEndDate);

      let dates = {};
      let currentDate = new Date(startDate);
      const stopDate = new Date(newEndDate);

      while (currentDate <= stopDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        dates[dateString] = { color: COLORS.PRIMARY.LIGHT, textColor: 'white' };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setMarkedDates({
        ...dates,
        [startDate]: { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
        [newEndDate]: { endingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
      });
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        minDate={new Date().toISOString().split('T')[0]}
        onDayPress={onDayPress}
        markingType={'period'}
        markedDates={markedDates}
        theme={{
          backgroundColor: COLORS.BACKGROUND.CARD,
          calendarBackground: COLORS.BACKGROUND.CARD,
          textSectionTitleColor: COLORS.TEXT.SECONDARY,
          selectedDayBackgroundColor: COLORS.PRIMARY.MAIN,
          selectedDayTextColor: '#ffffff',
          todayTextColor: COLORS.PRIMARY.MAIN,
          dayTextColor: COLORS.TEXT.PRIMARY,
          textDisabledColor: COLORS.TEXT.PLACEHOLDER,
          arrowColor: COLORS.PRIMARY.MAIN,
          monthTextColor: COLORS.TEXT.PRIMARY,
          indicatorColor: COLORS.PRIMARY.MAIN,
          textDayFontFamily: 'Poppins-Regular',
          textMonthFontFamily: 'Poppins-SemiBold',
          textDayHeaderFontFamily: 'Poppins-Medium',
        }}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={!startDate || !endDate}>
        <Text weight="semibold" color={!startDate || !endDate ? COLORS.TEXT.PLACEHOLDER : 'white'}>
          Confirm
        </Text>
        <Ionicons name="checkmark-circle-outline" size={20} color={!startDate || !endDate ? COLORS.TEXT.PLACEHOLDER : 'white'} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.SM,
    marginTop: SPACING.MD,
  },
});

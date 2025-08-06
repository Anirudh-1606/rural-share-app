import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Button from './Button';
import { COLORS, SPACING } from '../utils';

interface DateRangeCalendarProps {
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function DateRangeCalendar({ onConfirm, initialStartDate, initialEndDate }: DateRangeCalendarProps) {
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' },
      });
    } else {
      setEndDate(day.dateString);
      const range = getDatesInRange(startDate, day.dateString);
      const newMarkedDates = { ...markedDates };
      range.forEach((date, index) => {
        if (index === 0) {
          newMarkedDates[date] = { startingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' };
        } else if (index === range.length - 1) {
          newMarkedDates[date] = { endingDay: true, color: COLORS.PRIMARY.MAIN, textColor: 'white' };
        } else {
          newMarkedDates[date] = { color: COLORS.PRIMARY.LIGHT, textColor: 'white' };
        }
      });
      setMarkedDates(newMarkedDates);
    }
  };

  const getDatesInRange = (start: string, end: string) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markingType={'period'}
        markedDates={markedDates}
        theme={{
          todayTextColor: COLORS.PRIMARY.MAIN,
          arrowColor: COLORS.PRIMARY.MAIN,
        }}
      />
      <Button
        title="Confirm"
        onPress={() => onConfirm(startDate!, endDate!)}
        disabled={!startDate || !endDate}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,

  },
  button: {
    marginTop: 10,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read?: boolean;
};

const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Welcome to RuralShare',
    body: 'Thanks for joining. We will notify you about new bookings and updates.',
    time: 'Just now',
  },
  {
    id: '2',
    title: 'Tip of the day',
    body: 'Keep your listing photos clear and well-lit to attract more seekers.',
    time: '2h ago',
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<NotificationItem[]>(dummyNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      {/* Header */}
      <View style={styles.header}>

        <Text variant="h4" weight="semibold" style={styles.headerTitle}>
          Notifications
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={COLORS.TEXT.SECONDARY} />
          <Text variant="h4" weight="semibold" style={styles.emptyTitle}>No notifications</Text>
          <Text variant="body" color={COLORS.TEXT.SECONDARY} align="center" style={styles.emptyText}>
            You will see new notifications here as they arrive.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY.MAIN]} />}
        >
          {items.map(n => (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardIcon}> 
                <Ionicons name="notifications-outline" size={20} color={COLORS.PRIMARY.MAIN} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="semibold" style={styles.cardTitle}>{n.title}</Text>
                <Text variant="caption" color={COLORS.TEXT.SECONDARY}>{n.body}</Text>
              </View>
              <Text variant="caption" color={COLORS.TEXT.SECONDARY}>{n.time}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT.PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },
  emptyTitle: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    marginBottom: SPACING.LG,
  },
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING['4XL'],
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    marginBottom: 2,
  },
});

export default NotificationsScreen;



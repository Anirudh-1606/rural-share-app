import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProviderScreen = () => {
  const stats = [
    { label: 'Active Listings', value: '12', icon: 'list-outline', color: COLORS.PRIMARY.MAIN },
    { label: 'Total Bookings', value: '48', icon: 'calendar-outline', color: COLORS.SECONDARY.DARK },
    { label: 'Rating', value: '4.8', icon: 'star', color: '#FFB800' },
    { label: 'Earnings', value: '₹45K', icon: 'cash-outline', color: COLORS.PRIMARY.DARK },
  ];

  const quickActions = [
    { label: 'Add Service', icon: 'add-circle-outline', color: COLORS.PRIMARY.MAIN },
    { label: 'My Listings', icon: 'list-outline', color: COLORS.SECONDARY.DARK },
    { label: 'Bookings', icon: 'calendar-outline', color: '#FF6B6B' },
    { label: 'Analytics', icon: 'bar-chart-outline', color: '#4ECDC4' },
  ];

  const recentBookings = [
    { service: 'Tractor Rental', customer: 'Rajesh Kumar', date: 'Today, 2:00 PM', status: 'confirmed' },
    { service: 'Ploughing Service', customer: 'Priya Singh', date: 'Tomorrow, 10:00 AM', status: 'pending' },
    { service: 'Seed Sowing', customer: 'Amit Patel', date: 'Dec 28, 9:00 AM', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return COLORS.PRIMARY.MAIN;
      case 'pending': return '#FFB800';
      case 'completed': return COLORS.TEXT.SECONDARY;
      default: return COLORS.TEXT.SECONDARY;
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>Welcome back,</Text>
            <Text variant="h3" weight="bold">Service Provider</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.TEXT.PRIMARY} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.statsContainer}
        >
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text variant="h3" weight="bold" style={styles.statValue}>{stat.value}</Text>
              <Text variant="caption" color={COLORS.TEXT.SECONDARY}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={28} color={action.color} />
                </View>
                <Text variant="caption" align="center" style={styles.quickActionLabel}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">Recent Bookings</Text>
            <TouchableOpacity>
              <Text variant="body" color={COLORS.PRIMARY.MAIN}>View all</Text>
            </TouchableOpacity>
          </View>
          
          {recentBookings.map((booking, index) => (
            <TouchableOpacity key={index} style={styles.bookingCard}>
              <View style={styles.bookingInfo}>
                <Text variant="body" weight="semibold">{booking.service}</Text>
                <View style={styles.bookingDetails}>
                  <Ionicons name="person-outline" size={14} color={COLORS.TEXT.SECONDARY} />
                  <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={{ marginLeft: 4 }}>
                    {booking.customer}
                  </Text>
                </View>
                <View style={styles.bookingDetails}>
                  <Ionicons name="time-outline" size={14} color={COLORS.TEXT.SECONDARY} />
                  <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={{ marginLeft: 4 }}>
                    {booking.date}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.status)}20` }]}>
                <Text variant="caption" weight="semibold" color={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Service CTA */}
        <TouchableOpacity style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <Ionicons name="add-circle" size={48} color={COLORS.PRIMARY.MAIN} />
            <View style={styles.ctaText}>
              <Text variant="body" weight="semibold">List a New Service</Text>
              <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
                Expand your offerings and reach more customers
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.PRIMARY.MAIN} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING['4XL'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.FULL,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderRadius: 4,
  },
  statsContainer: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  statCard: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    minWidth: 120,
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  statValue: {
    marginBottom: SPACING.XS,
  },
  section: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
  },
  sectionTitle: {
    marginBottom: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  quickActionCard: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    width: '48%',
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  quickActionLabel: {
    marginTop: SPACING.XS,
  },
  bookingCard: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XS,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  ctaCard: {
    backgroundColor: COLORS.BACKGROUND.HIGHLIGHT,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ctaText: {
    marginLeft: SPACING.MD,
    flex: 1,
  },
});

export default ProviderScreen;
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SHADOWS, FONTS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ProviderService, { ProviderDashboardResponse } from '../services/ProviderService';
import Button from '../components/Button';

const backgroundImg = require('../assets/provider-bg.png');

const ProviderScreen = () => {
  const navigation = useNavigation<any>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [dashboard, setDashboard] = useState<ProviderDashboardResponse | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = useMemo(() => {
    const summary = dashboard?.summary;
    return [
      {
        label: 'Bookings',
        value: String(summary?.totalBookings ?? 0),
        icon: 'calendar',
        bgColor: '#fff3e0',
        iconColor: '#f57c00',
      },
      {
        label: 'Listings',
        value: String(summary?.activeListings ?? 0),
        icon: 'list',
        bgColor: '#fff3e0',
        iconColor: '#f57c00',
      },
      {
        label: 'Rating',
        value: String(summary?.averageRating ?? 0),
        icon: 'star',
        bgColor: '#fff3e0',
        iconColor: '#f57c00',
      },
    ];
  }, [dashboard]);

  // quickActions placeholder removed (inline JSX is used)


  const fetchDashboard = async (isRefresh = false) => {
    if (!user?.id) {
      if (isRefresh) setRefreshing(false);
      return;
    }
    try {
      if (isRefresh) setRefreshing(true);
      const data = await ProviderService.getDashboard(user.id, token || undefined);
      setDashboard(data);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token]);

  const onRefresh = () => fetchDashboard(true);

  // Refresh when returning from Create Listing or any navigation back
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => fetchDashboard());
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, user?.id, token]);

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" style={styles.flex}>
      {/* Background Image */}
      <Image 
        source={backgroundImg} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY.MAIN]}
          />
        }
      >
        {/* Header with Gradient Background */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingText}>
                    {getGreeting()}
                  </Text>
                  <Text style={styles.waveEmoji}> 👋</Text>
                </View>
                <Text style={styles.providerName}>
                  Service Provider
                </Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={18} color={COLORS.NEUTRAL.WHITE} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerCircle} />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                <Ionicons name={stat.icon as any} size={18} color={stat.iconColor} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => navigation.navigate('CreateListing')}
              >
                <View style={styles.quickActionIconWrapper}>
                  <Ionicons name="add-circle-outline" size={28} color={COLORS.PRIMARY.MAIN} />
                </View>
                <Text style={styles.quickActionLabel}>Add New</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => navigation.navigate('MyListings')}
              >
                <View style={styles.quickActionIconWrapper}>
                  <Ionicons name="document-text-outline" size={26} color={COLORS.PRIMARY.MAIN} />
                </View>
                <Text style={styles.quickActionLabel}>My Listings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionItem}  onPress={() => navigation.navigate('ProviderBookings')}>
                <View style={styles.quickActionIconWrapper}>
                  <Ionicons name="calendar-outline" size={26} color={COLORS.PRIMARY.MAIN} />
                </View>
                <Text style={styles.quickActionLabel}>Bookings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionItem}>
                <View style={styles.quickActionIconWrapper}>
                  <Ionicons name="bar-chart-outline" size={28} color={COLORS.PRIMARY.MAIN} />
                </View>
                <Text style={styles.quickActionLabel}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            {(dashboard?.recentBookings?.length || 0) > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('ProviderBookings')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {(dashboard?.recentBookings || []).length === 0 ? (
            <View style={styles.emptyBookingsCard}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="calendar-clear-outline" size={24} color={COLORS.PRIMARY.MAIN} />
              </View>
              <Text style={styles.emptyTitle}>No recent bookings</Text>
              <Text style={styles.emptySubtitle}>New bookings will appear here as customers book your listings.</Text>
              <Button
                title="Go to Bookings"
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('ProviderBookings')}
                style={styles.emptyCta}
              />
            </View>
          ) : (
          (dashboard?.recentBookings || []).map((booking, index) => (
            <View key={index} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>
                    {booking.service || booking.listingTitle || 'Service'}
                  </Text>
                  <Text style={styles.customerName}>
                    {booking.customer || booking.customerName || ''}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {booking.status || '—'}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingTime}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.timeText}>
                  {booking.time || booking.scheduledAt || ''}
                </Text>
              </View>
            </View>
          )))}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent', // Changed to transparent
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    width: '100%',
    height: 400, // Increased height
    opacity: 0.5, // Reduced opacity for subtlety
  },
  headerContainer: {
    height: 190,
    backgroundColor: COLORS.PRIMARY.MAIN,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  greetingText: {
    fontSize: FONT_SIZES.SM,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FONTS.POPPINS.REGULAR,
  },
  waveEmoji: {
    fontSize: FONT_SIZES.SM,
  },
  providerName: {
    fontSize: FONT_SIZES.XL,
    color: COLORS.NEUTRAL.WHITE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
  },
  notificationButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    backgroundColor: '#ff4757',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: COLORS.NEUTRAL.WHITE,
  },
  headerCircle: {
    position: 'absolute',
    right: -80,
    top: -20,
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 125,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -90,
    gap: 12,
    zIndex: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...SHADOWS.MD,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: FONT_SIZES.LG,
    fontFamily: FONTS.POPPINS.BOLD,
    color: COLORS.TEXT.PRIMARY,
    lineHeight: 28,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    fontWeight: '500',
  },
  viewAllText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.PRIMARY.MAIN,
  },
  quickActionsContainer: {
    marginTop: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    
  },
  quickActionItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 12,
    // backgroundColor: COLORS.NEUTRAL.WHITE,
    // borderRadius: BORDER_RADIUS.MD,
  },
  quickActionIconWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#6B7280',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    ...SHADOWS.SM,
  },
  emptyBookingsCard: {
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.SM,
  },
  emptyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyCta: {
    paddingHorizontal: 14,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 2,
  },
  customerName: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
  },
  statusBadge: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#155724',
  },
  bookingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
    marginLeft: 6,
  },
  bottomPad: {
    height: 100,
  },
});

export default ProviderScreen;
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const backgroundImg = require('../assets/provider-bg.png');

const ProviderScreen = () => {
  const navigation = useNavigation<any>();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { 
      label: 'Bookings', 
      value: '48', 
      icon: 'calendar', 
      bgColor: '#fff3e0',
      iconColor: '#f57c00' 
    },
    { 
      label: 'Listings', 
      value: '12', 
      icon: 'list', 
       bgColor: '#fff3e0',
      iconColor: '#f57c00' 
    },
    { 
      label: 'Rating', 
      value: '4.2', 
      icon: 'star', 
      bgColor: '#fff3e0',
      iconColor: '#f57c00' 
    },
  ];

  const quickActions = [
    { label: 'Add New', icon: 'add-circle-outline' },
    { label: 'My Listings', icon: 'document-text-outline' },
    { label: 'Bookings', icon: 'checkmark-done-outline' },
    { label: 'Analytics', icon: 'bar-chart-outline' },
  ];


  //to put in data bro 

  const recentBookings = [
    { 
      service: 'Tractor Rental', 
      customer: 'Rajesh Kumar', 
      time: 'Today, 2:00 PM', 
      status: 'Confirmed' 
    },
  ];

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" style={{ flex: 1}}>
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
                <Ionicons name={stat.icon} size={18} color={stat.iconColor} />
              </View>
              <Text style={styles.statValue}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>
                {stat.label}
              </Text>
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
                onPress={() => navigation.navigate('MyListingsScreen')}
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
            <Text style={styles.sectionTitle}>
              Recent Bookings
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentBookings.map((booking, index) => (
            <View key={index} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>
                    {booking.service}
                  </Text>
                  <Text style={styles.customerName}>
                    {booking.customer}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingTime}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.timeText}>
                  {booking.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
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
});

export default ProviderScreen;
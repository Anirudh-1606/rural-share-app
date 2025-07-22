import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BookingService, { Booking, BookingsResponse } from '../services/BookingService';

const { width: screenWidth } = Dimensions.get('window');
const TAB_WIDTH = (screenWidth - 40) / 3;

type TabType = 'toReview' | 'active' | 'completed';

const ProviderBookingsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('toReview');
  const [bookings, setBookings] = useState<BookingsResponse>({
    active: [],
    completed: [],
    canceled: [],
    toReview: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Using dummy data for now
      setTimeout(() => {
        setBookings({
          toReview: [
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49389",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49384",
                title: "John Deere Tractor with Plough",
                price: 1500,
                unitOfMeasure: "per_day"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49387",
                name: "Rajesh Kumar",
                phone: "+91 98765 43210",
                email: "rajesh.kumar@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "pending",
              createdAt: "2025-01-18T14:30:00.000Z",
              expiresAt: "2025-01-22T12:00:00.000Z",
              totalAmount: 3000,
              coordinates: [78.1134, 18.0534],
              updatedAt: "2025-01-18T14:30:00.000Z",
              __v: 0,
              quantity: 2,
              serviceDate: "2025-01-20T09:00:00.000Z",
              notes: "Need for 2 hectares of land preparation"
            },
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49390",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49385",
                title: "Seed Sowing Machine",
                price: 800,
                unitOfMeasure: "per_hectare"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49388",
                name: "Priya Sharma",
                phone: "+91 87654 32109",
                email: "priya.sharma@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "pending",
              createdAt: "2025-01-19T10:15:00.000Z",
              expiresAt: "2025-01-23T12:00:00.000Z",
              totalAmount: 2400,
              coordinates: [78.2134, 18.1534],
              updatedAt: "2025-01-19T10:15:00.000Z",
              __v: 0,
              quantity: 3,
              serviceDate: "2025-01-21T08:00:00.000Z"
            }
          ],
          active: [
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49391",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49386",
                title: "Drip Irrigation System Installation",
                price: 5000,
                unitOfMeasure: "per_hectare"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49389",
                name: "Suresh Reddy",
                phone: "+91 99887 76655",
                email: "suresh.reddy@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "accepted",
              createdAt: "2025-01-17T09:00:00.000Z",
              expiresAt: "2025-01-25T12:00:00.000Z",
              totalAmount: 15000,
              coordinates: [78.3134, 18.2534],
              updatedAt: "2025-01-17T09:00:00.000Z",
              __v: 0,
              quantity: 3,
              serviceDate: "2025-01-22T07:00:00.000Z",
              notes: "Installation for 3 hectares of vegetable farm"
            },
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49392",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49387",
                title: "Harvesting Service",
                price: 2000,
                unitOfMeasure: "per_hectare"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49390",
                name: "Amit Patel",
                phone: "+91 77889 99001",
                email: "amit.patel@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "paid",
              createdAt: "2025-01-16T11:30:00.000Z",
              expiresAt: "2025-01-24T12:00:00.000Z",
              totalAmount: 8000,
              coordinates: [78.0134, 17.9534],
              updatedAt: "2025-01-16T11:30:00.000Z",
              __v: 0,
              quantity: 4,
              serviceDate: "2025-01-23T06:00:00.000Z"
            }
          ],
          completed: [
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49393",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49388",
                title: "Land Preparation with Rotavator",
                price: 1200,
                unitOfMeasure: "per_hectare"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49391",
                name: "Vijay Singh",
                phone: "+91 66778 89900",
                email: "vijay.singh@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "completed",
              createdAt: "2025-01-10T08:00:00.000Z",
              expiresAt: "2025-01-18T12:00:00.000Z",
              totalAmount: 6000,
              coordinates: [78.4134, 18.3534],
              updatedAt: "2025-01-15T16:00:00.000Z",
              __v: 0,
              quantity: 5,
              serviceDate: "2025-01-12T07:00:00.000Z"
            },
            {
              isAutoRejected: false,
              _id: "6871c690e7fd8a5bc9a49394",
              listingId: {
                _id: "6871c639e7fd8a5bc9a49389",
                title: "Pesticide Spraying Service",
                price: 500,
                unitOfMeasure: "per_hectare"
              },
              seekerId: {
                _id: "6871c683e7fd8a5bc9a49392",
                name: "Lakshmi Devi",
                phone: "+91 55667 78899",
                email: "lakshmi.devi@example.com"
              },
              providerId: "687145eb6d913a8f9c3c6d4e",
              status: "completed",
              createdAt: "2025-01-08T10:00:00.000Z",
              expiresAt: "2025-01-16T12:00:00.000Z",
              totalAmount: 2000,
              coordinates: [78.5134, 18.4534],
              updatedAt: "2025-01-10T14:00:00.000Z",
              __v: 0,
              quantity: 4,
              serviceDate: "2025-01-09T06:30:00.000Z",
              notes: "Organic pesticide spray for cotton crop"
            }
          ],
          canceled: []
        });
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dummy data:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleAcceptBooking = async (bookingId: string) => {
    Alert.alert(
      'Accept Booking',
      'Are you sure you want to accept this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              // For now, just update the local state
              setBookings(prev => {
                const booking = prev.toReview.find(b => b._id === bookingId);
                if (booking) {
                  booking.status = 'accepted';
                  return {
                    ...prev,
                    toReview: prev.toReview.filter(b => b._id !== bookingId),
                    active: [...prev.active, booking]
                  };
                }
                return prev;
              });
              Alert.alert('Success', 'Booking accepted successfully');
            } catch (error) {
              console.error('Error accepting booking:', error);
              Alert.alert('Error', 'Failed to accept booking. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleRejectBooking = async (bookingId: string) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              // For now, just update the local state
              setBookings(prev => ({
                ...prev,
                toReview: prev.toReview.filter(b => b._id !== bookingId)
              }));
              Alert.alert('Success', 'Booking rejected');
            } catch (error) {
              console.error('Error rejecting booking:', error);
              Alert.alert('Error', 'Failed to reject booking. Please try again.');
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
      case 'paid':
        return '#10B981';
      case 'completed':
        return '#3B82F6';
      case 'rejected':
      case 'canceled':
        return '#EF4444';
      default:
        return COLORS.TEXT.SECONDARY;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBookingCard = (booking: Booking, showActions: boolean = false) => {
    const listing = typeof booking.listingId === 'object' ? booking.listingId : null;
    const seeker = typeof booking.seekerId === 'object' ? booking.seekerId : null;

    return (
      <TouchableOpacity
        key={booking._id}
        style={styles.bookingCard}
        onPress={() => navigation.navigate('OrderDetail', { bookingId: booking._id })}
        activeOpacity={0.8}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.bookingInfo}>
            <Text variant="body" weight="semibold" numberOfLines={1} style={styles.bookingTitle}>
              {listing?.title || 'Service Booking'}
            </Text>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              {seeker?.name || 'Customer'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.status)}20` }]}>
            <Text 
              variant="caption" 
              weight="medium" 
              style={{ color: getStatusColor(booking.status) }}
            >
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={COLORS.TEXT.SECONDARY} />
            <Text variant="body" weight="semibold" color={COLORS.PRIMARY.MAIN}>
              ₹{booking.totalAmount}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.TEXT.SECONDARY} />
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              {formatDate(booking.createdAt)}
            </Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleRejectBooking(booking._id);
              }}
            >
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text variant="body" weight="medium" color="#EF4444" style={{ marginLeft: 6 }}>
                Decline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleAcceptBooking(booking._id);
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.PRIMARY.MAIN} />
              <Text variant="body" weight="medium" color={COLORS.PRIMARY.MAIN} style={{ marginLeft: 6 }}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = (type: string) => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={type === 'toReview' ? 'time-outline' : type === 'active' ? 'hourglass-outline' : 'checkmark-circle-outline'} 
        size={64} 
        color={COLORS.TEXT.SECONDARY} 
      />
      <Text variant="h4" weight="semibold" style={styles.emptyTitle}>
        No {type === 'toReview' ? 'Pending' : type.charAt(0).toUpperCase() + type.slice(1)} Bookings
      </Text>
      <Text variant="body" color={COLORS.TEXT.SECONDARY} align="center" style={styles.emptyText}>
        {type === 'toReview' 
          ? 'New booking requests will appear here'
          : type === 'active'
          ? 'Your ongoing bookings will appear here'
          : 'Your completed bookings will appear here'}
      </Text>
    </View>
  );

  const getTabData = () => {
    switch (activeTab) {
      case 'toReview':
        return bookings.toReview;
      case 'active':
        return bookings.active;
      case 'completed':
        return bookings.completed;
      default:
        return [];
    }
  };

  const tabData = getTabData();

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text variant="h3" weight="semibold" style={styles.headerTitle}>
          My Bookings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'toReview' && styles.activeTab]}
          onPress={() => setActiveTab('toReview')}
        >
          <Text
            variant="body"
            weight={activeTab === 'toReview' ? 'semibold' : 'regular'}
            color={activeTab === 'toReview' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY}
          >
            To Review
          </Text>
          {bookings.toReview.length > 0 && (
            <View style={styles.tabBadge}>
              <Text variant="caption" weight="semibold" color="#fff">
                {bookings.toReview.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            variant="body"
            weight={activeTab === 'active' ? 'semibold' : 'regular'}
            color={activeTab === 'active' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY}
          >
            Active
          </Text>
          {bookings.active.length > 0 && (
            <View style={styles.tabBadge}>
              <Text variant="caption" weight="semibold" color="#fff">
                {bookings.active.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            variant="body"
            weight={activeTab === 'completed' ? 'semibold' : 'regular'}
            color={activeTab === 'completed' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY}
          >
            Completed
          </Text>
          {bookings.completed.length > 0 && (
            <View style={styles.tabBadge}>
              <Text variant="caption" weight="semibold" color="#fff">
                {bookings.completed.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
        </View>
      ) : tabData.length === 0 ? (
        renderEmptyState(activeTab)
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY.MAIN]}
            />
          }
        >
          {tabData.map((booking) => renderBookingCard(booking, activeTab === 'toReview'))}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY.MAIN,
  },
  tabBadge: {
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING['4XL'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    ...SHADOWS.SM,
    overflow: 'hidden',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  bookingInfo: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  bookingTitle: {
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    paddingBottom: SPACING.MD,
    gap: SPACING.SM,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1.5,
  },
  acceptButton: {
    backgroundColor: `${COLORS.PRIMARY.MAIN}10`,
    borderColor: COLORS.PRIMARY.MAIN,
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
});

export default ProviderBookingsScreen;
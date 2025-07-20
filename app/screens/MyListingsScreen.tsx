/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ListingService from '../services/ListingService';

interface Listing {
  _id: string;
  title: string;
  description: string;
  photos: string[];
  price: number;
  unitOfMeasure: string;
  minimumOrder: number;
  isActive: boolean;
  tags: string[];
  viewCount: number;
  bookingCount: number;
  createdAt: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

const MyListingsScreen = () => {
  const navigation = useNavigation<any>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Hardcoded provider ID as requested
      const response = await ListingService.getProviderListings('687b5692b9434ec2d0e7adc9');
      setListings(response);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const getUnitLabel = (unit: string) => {
    const unitLabels: { [key: string]: string } = {
      'per_hour': '/hr',
      'per_day': '/day',
      'per_hectare': '/ha',
      'per_kg': '/kg',
      'per_unit': '/unit',
    };
    return unitLabels[unit] || unit;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.TEXT.SECONDARY} />
      <Text variant="h4" weight="semibold" style={styles.emptyTitle}>
        No listings yet
      </Text>
      <Text variant="body" color={COLORS.TEXT.SECONDARY} align="center" style={styles.emptyText}>
        Start by creating your first listing to offer services to others
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateListing')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text variant="body" weight="semibold" color="#fff" style={{ marginLeft: 8 }}>
          Create Listing
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ListingCard = ({ listing }: { listing: Listing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => navigation.navigate('ListingDetail', { listingId: listing._id })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: listing.photos[0] || 'https://via.placeholder.com/100' }}
        style={styles.listingImage}
      />
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text variant="body" weight="semibold" numberOfLines={1} style={styles.listingTitle}>
            {listing.title}
          </Text>
          <View style={[styles.statusBadge, !listing.isActive && styles.statusBadgeInactive]}>
            <Text variant="caption" weight="medium" color={listing.isActive ? COLORS.PRIMARY.MAIN : '#6B7280'}>
              {listing.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        {/* <Text variant="caption" color={COLORS.TEXT.SECONDARY} numberOfLines={2} style={styles.listingDescription}>
          {listing.description}
        </Text> */}

        <View style={styles.listingMeta}>
          <View style={styles.priceContainer}>
            <Text variant="h4" weight="bold" color={COLORS.PRIMARY.MAIN}>
              ₹{listing.price}
            </Text>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              {getUnitLabel(listing.unitOfMeasure)}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color={COLORS.TEXT.SECONDARY} />
              <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={{ marginLeft: 4 }}>
                {listing.viewCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.TEXT.SECONDARY} />
              <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={{ marginLeft: 4 }}>
                {listing.bookingCount}
              </Text>
            </View>
          </View>
        </View>

        {/* {listing.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {listing.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text variant="caption" color={COLORS.PRIMARY.MAIN}>
                  {tag}
                </Text>
              </View>
            ))}
            {listing.tags.length > 3 && (
              <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
                +{listing.tags.length - 3}
              </Text>
            )}
          </View>
        )} */}

        <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={styles.createdDate}>
          Listed on {formatDate(listing.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text variant="h3" weight="semibold" style={styles.headerTitle}>
          My Listings
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Ionicons name="add" size={24} color={COLORS.PRIMARY.MAIN} />
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      {listings.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statCard}>
            <Text variant="h3" weight="bold" color={COLORS.PRIMARY.MAIN}>
              {listings.length}
            </Text>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              Total Listings
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="h3" weight="bold" color={COLORS.PRIMARY.MAIN}>
              {listings.filter(l => l.isActive).length}
            </Text>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              Active
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="h3" weight="bold" color={COLORS.PRIMARY.MAIN}>
              {listings.reduce((sum, l) => sum + l.bookingCount, 0)}
            </Text>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
              Bookings
            </Text>
          </View>
        </View>
      )}

      {/* Listings */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
        </View>
      ) : listings.length === 0 ? (
        <EmptyState />
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
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: '#fff',
    gap: SPACING.SM,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.SM,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY.MAIN,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.MD,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    ...SHADOWS.SM,
    overflow: 'hidden',
  },
  listingImage: {
    width: 100,
    height: '100%',
    backgroundColor: COLORS.BACKGROUND.CARD,
  },
  listingContent: {
    flex: 1,
    padding: SPACING.MD,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.XS,
  },
  listingTitle: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  statusBadge: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusBadgeInactive: {
    backgroundColor: COLORS.BACKGROUND.CARD,
  },
  listingDescription: {
    marginBottom: SPACING.SM,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
    marginBottom: SPACING.SM,
  },
  tag: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  createdDate: {
    marginTop: SPACING.XS,
  },
});

export default MyListingsScreen;
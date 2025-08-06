/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Text from './Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ListingService, { Listing, PopulatedListing } from '../services/ListingService';
import categoryHierarchy from '../../docs/category hierarchy.json';

interface ListingCardProps {
  listing: Listing | PopulatedListing;
  onListingUpdate?: () => void;
}

const ListingCard = ({ listing, onListingUpdate }: ListingCardProps) => {
  const navigation = useNavigation<any>();
  const { token } = useSelector((state: RootState) => state.auth);

  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions to safely access category/subcategory names
  const getCategoryName = () => {
    if (typeof listing.categoryId === 'object' && listing.categoryId?.name) {
      return listing.categoryId.name;
    }
    // Look up category name from hierarchy JSON
    const category = categoryHierarchy.find(cat => cat._id === listing.categoryId);
    return category?.name || 'Category';
  };

  const getSubCategoryName = () => {
    if (typeof listing.subCategoryId === 'object' && listing.subCategoryId?.name) {
      return listing.subCategoryId.name;
    }
    // Look up subcategory name from hierarchy JSON
    for (const category of categoryHierarchy) {
      const subcategory = category.subcategories?.find(sub => sub._id === listing.subCategoryId);
      if (subcategory) {
        return subcategory.name;
      }
    }
    return 'Service';
  };

  const getUnitLabel = (unit: string) => {
    const unitLabels: { [key: string]: string } = {
      per_hour: '/hr',
      per_day: '/day',
      per_hectare: '/ha',
      per_kg: '/kg',
      per_unit: '/unit',
      per_piece: '/piece',
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

  const handleToggleActive = async () => {
    try {
      setIsLoading(true);
      const authToken = token || undefined;
      if (!authToken) throw new Error('Authentication token not found');

      await ListingService.toggleListingStatus(listing._id, !listing.isActive, authToken);
      if (onListingUpdate) {
        onListingUpdate();
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Failed to update listing status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const authToken = token || undefined;
              if (!authToken) throw new Error('Authentication token not found');
              await ListingService.deleteListing(listing._id, authToken);
              if (onListingUpdate) {
                onListingUpdate();
              }
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', 'Failed to delete listing');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('ListingDetail', { listingId: listing._id })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: listing.photos[0] || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="h4" weight="bold" numberOfLines={2} style={styles.title}>
              {getSubCategoryName()}
            </Text>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={COLORS.TEXT.SECONDARY} />
            </TouchableOpacity>
          </View>
          {showMenu && (
            <View style={styles.menuDropdown}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate('CreateListing', { listingId: listing._id });
                }}
              >
                <Ionicons name="create-outline" size={18} color={COLORS.TEXT.PRIMARY} />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={[styles.menuText, { color: "#EF4444" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={styles.description}>
          {getCategoryName()}
        </Text>

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
          <TouchableOpacity 
            style={[
              styles.statusToggle,
              { backgroundColor: listing.isActive ? COLORS.PRIMARY.LIGHT : COLORS.NEUTRAL.GRAY[100] }
            ]}
            onPress={handleToggleActive}
            disabled={isLoading}
          >
            <Text 
              variant="caption" 
              color={listing.isActive ? COLORS.PRIMARY.DARK : COLORS.TEXT.SECONDARY}
            >
              {listing.isActive ? 'Active' : 'Inactive'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={styles.date}>
          Listed on {formatDate(listing.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Text from './Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ListingService, { Listing, PopulatedListing } from '../services/ListingService';
import categoryHierarchy from '../../docs/category hierarchy.json';

interface ListingCardProps {
  listing: Listing | PopulatedListing;
  onListingUpdate?: () => void; // Keep this for now, might be used elsewhere
}

const ListingCard = ({ listing, onListingUpdate }: ListingCardProps) => {
  const navigation = useNavigation<any>();
  const { token } = useSelector((state: RootState) => state.auth);

  // Helper functions to safely access category/subcategory names
  const getSubCategoryName = () => {
    if (typeof listing.subCategoryId === 'object' && listing.subCategoryId?.name) {
      return listing.subCategoryId.name;
    }
    // Look up subcategory name from hierarchy JSON
    for (const category of categoryHierarchy) {
      const subcategory = category.subcategories?.find(sub => sub._id === listing.subCategoryId);
      if (subcategory) {
        return subcategory.name;
      }
    }
    return 'Service';
  };

  const getUnitLabel = (unit: string) => {
    const unitLabels: { [key: string]: string } = {
      per_hour: '/hr',
      per_day: '/day',
      per_hectare: '/ha',
      per_kg: '/kg',
      per_unit: '/unit',
      per_piece: '/piece',
    };
    return unitLabels[unit] || unit;
  };

  // Placeholder for key spec - using description for now
  const getKeySpec = () => {
    return listing.description ? listing.description.substring(0, 50) + '...' : 'No specific details';
  };

  // Placeholder for rating and reviews
  const getRatingAndReviews = () => {
    // In a real app, this would come from listing data
    return '★ 4.5 (25 reviews)'; 
  };

  // Placeholder for distance
  const getDistance = () => {
    // In a real app, this would be calculated based on user's current location and listing's coordinates
    return '5 km away';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('ListingDetail', { listingId: listing._id })}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: listing.photos[0] || 'https://via.placeholder.com/100' }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.NEUTRAL.WHITE} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title || getSubCategoryName()} 
        </Text>

        <Text style={styles.keySpec} numberOfLines={1}>
          {getKeySpec()}
        </Text>

        <View style={styles.ratingLocationContainer}>
          <Text style={styles.ratingText}>{getRatingAndReviews()}</Text>
          <Text style={styles.locationText}>{getDistance()}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>
            ₹{listing.price}
          </Text>
          <Text style={styles.priceUnit}>
            {getUnitLabel(listing.unitOfMeasure)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Changed to column for grid layout
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    overflow: 'hidden',
    ...SHADOWS.SM,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: BORDER_RADIUS.LG,
    borderTopRightRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%', // Take full width of the card
    height: '100%', // Fixed height for the image
    backgroundColor: COLORS.NEUTRAL.GRAY[200],
    resizeMode: 'cover', // Ensure image covers the area
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BORDER_RADIUS.FULL,
    padding: SPACING.XS,
  },
  content: {
    flex: 1, // Allow content to take remaining space
    padding: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.XS,
  },
  keySpec: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    marginBottom: SPACING.XS,
  },
  ratingLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.SM,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.BOLD,
    color: COLORS.PRIMARY.MAIN,
    marginRight: SPACING.XS,
  },
  priceUnit: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
});

export default ListingCard;


export default ListingCard;

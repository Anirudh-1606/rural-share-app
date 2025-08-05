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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    overflow: 'hidden',
    ...SHADOWS.SM,
  },
  image: {
    width: 100,
    height: '100%',
    backgroundColor: COLORS.NEUTRAL.GRAY[200],
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
  header: {
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  title: {
    flex: 1,
    marginRight: SPACING.SM,
    fontSize: 16,
    color: COLORS.TEXT.PRIMARY,
  },
  description: {
    marginBottom: SPACING.SM,
  },
  menuButton: {
    padding: SPACING.XS,
  },
  menuDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
    ...SHADOWS.MD,
    zIndex: 1000,
    width: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.SM,
  },
  menuText: {
    marginLeft: SPACING.SM,
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.SM,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  statusToggle: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    marginLeft: 'auto',
  },
  date: {
    marginTop: SPACING.XS,
  },
});

export default ListingCard;

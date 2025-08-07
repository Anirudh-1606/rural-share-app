import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Text from './Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, SUCCESS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Listing, PopulatedListing } from '../services/ListingService';
import categoryHierarchy from '../../docs/category hierarchy.json';

interface SearchListingCardProps {
  listing: Listing | PopulatedListing;
}

const SearchListingCard = ({ listing }: SearchListingCardProps) => {
  const navigation = useNavigation<any>();

  // Helper functions to safely access category/subcategory names
  const getSubCategoryName = () => {
    if (typeof listing.subCategoryId === 'object' && listing.subCategoryId?.name) {
      return listing.subCategoryId.name;
    }
    // Fallback to a generic name if subCategory is not populated or name is missing
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

  const getProviderName = () => {
    // Assuming providerId is populated with a name field
    if (typeof listing.providerId === 'object' && listing.providerId?.name) {
      return listing.providerId.name;
    }
    return 'Unknown Provider';
  };

  const isProviderVerified = () => {
    // Assuming providerId is populated with an isVerified field
    if (typeof listing.providerId === 'object' && listing.providerId?.isVerified !== undefined) {
      return listing.providerId.isVerified;
    }
    return false;
  };

  const getKeySpecs = () => {
    // This is a placeholder. In a real app, you'd parse listing.tags or other specific fields.
    // For now, let's use a dummy array or part of the description.
    if (listing.tags && listing.tags.length > 0) {
      return listing.tags.map(tag => `[ ${tag} ]`).join(' ');
    }
    return listing.description ? `[ ${listing.description.substring(0, 20)}... ]` : '';
  };

  const getDistance = () => {
    // This would typically come from a location service calculation
    return '5 km away';
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('ListingDetail', { listingId: listing._id })}
      activeOpacity={0.8}
    >
      {/* Primary Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.photos[0] || 'https://via.placeholder.com/150' }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {listing.title || getSubCategoryName()}
        </Text>

        {/* Core Information Block */}
        <View style={styles.coreInfoBlock}>
          <Text style={styles.priceText}>
            ₹{listing.price} {getUnitLabel(listing.unitOfMeasure)}
          </Text>
          <View style={styles.specsDistanceContainer}>
            <Text style={styles.keySpecsText}>{getKeySpecs()}</Text>
            <Text style={styles.distanceText}>
              <Ionicons name="location-outline" size={14} color={COLORS.TEXT.SECONDARY} /> {getDistance()}
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Trust & Provider Block */}
        <View style={styles.providerBlock}>
          <Ionicons name="person-circle-outline" size={18} color={COLORS.TEXT.SECONDARY} />
          <Text style={styles.providerName}>{getProviderName()}</Text>
          {isProviderVerified() && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.SUCCESS.MAIN} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    overflow: 'hidden',
    ...SHADOWS.SM,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 150, // Approximately 40% of a typical card height
    overflow: 'hidden',
    borderTopLeftRadius: BORDER_RADIUS.LG,
    borderTopRightRadius: BORDER_RADIUS.LG,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: SPACING.MD,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.SM,
  },
  coreInfoBlock: {
    marginBottom: SPACING.MD,
  },
  priceText: {
    fontSize: 20,
    fontFamily: FONTS.POPPINS.BOLD,
    color: COLORS.PRIMARY.MAIN,
    marginBottom: SPACING.XS,
  },
  specsDistanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keySpecsText: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER.PRIMARY,
    marginVertical: SPACING.MD,
  },
  providerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
    marginLeft: SPACING.XS,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SUCCESS.LIGHT,
    borderRadius: BORDER_RADIUS.FULL,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    marginLeft: SPACING.SM,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.SUCCESS.DARK,
    marginLeft: SPACING.XS,
  },
});

export default SearchListingCard;
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS } from '../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ListingService from '../services/ListingService';
import ListingCard from '../components/ListingCard';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  unitOfMeasure: string;
  photos: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  providerId: string;
  categoryId: string;
  subCategoryId: string;
}

const ListingsScreen = () => {
  const { categoryId, subCategoryId } = useSelector((state: RootState) => state.listing);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId && subCategoryId) {
      fetchListingsByCategories(categoryId, subCategoryId);
    } else {
      // Optionally fetch all listings or show a message if no category is selected
      // For now, we'll just log a message
      console.log('No category or subcategory selected. Displaying all listings or a default view.');
      // fetchAllListings(); // Uncomment if you want to fetch all listings by default
    }
  }, [categoryId, subCategoryId]);

  const fetchListingsByCategories = async (catId: string, subCatId: string) => {
    try {
      setLoading(true);
      // Assuming ListingService has a method to fetch by category and subcategory
      const fetchedListings = await ListingService.getListingsByCategories(catId, subCatId);
      setListings(fetchedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Example of fetching all listings (if needed)
  // const fetchAllListings = async () => {
  //   try {
  //     setLoading(true);
  //     const fetchedListings = await ListingService.getAllListings();
  //     setListings(fetchedListings);
  //   } catch (error) {
  //     console.error('Error fetching all listings:', error);
  //     Alert.alert('Error', 'Failed to load all listings. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Listings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading listings...</Text>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))
        ) : (
          <Text style={styles.noListingsText}>No listings found for the selected categories.</Text>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
  },
  container: {
    padding: SPACING.LG,
  },
  loadingText: {
    padding: SPACING.LG,
    textAlign: 'center',
    color: COLORS.TEXT.SECONDARY,
  },
  noListingsText: {
    padding: SPACING.LG,
    textAlign: 'center',
    color: COLORS.TEXT.SECONDARY,
  },
});

export default ListingsScreen;

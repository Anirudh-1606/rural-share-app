import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLocation, setRadius } from '../store/slices/locationSlice';
import categoryIcons from '../utils/icons';
import ListingService, { Listing } from '../services/ListingService'; // Import ListingService and Listing type
import ListingCard from '../components/ListingCard'; // Assuming you have a ListingCard component

const { width: screenWidth } = Dimensions.get('window');

interface RouteParams {
  searchQuery?: string;
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  };
  categoryId?: string;
  subCategoryId?: string;
}

const SearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { searchQuery, dateRange, categoryId, subCategoryId } = route.params as RouteParams;
  
  const [search, setSearch] = useState(searchQuery || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [results, setResults] = useState<Listing[]>([]); // Change type to Listing[]
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Get date range and location from Redux
  const reduxDateRange = useSelector((state: RootState) => state.date);
  const activeDateRange = dateRange || reduxDateRange;
  const { latitude, longitude, city, radius } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    console.log('SearchResultsScreen: route.params:', route.params); // Log incoming params
    // Perform initial search
    performSearch();
  }, [search, activeDateRange, categoryId, subCategoryId, latitude, longitude, radius]); // Add dependencies

  const performSearch = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.text = search;
      if (categoryId) params.categoryId = categoryId;
      if (subCategoryId) params.subCategoryId = subCategoryId;
      
      // Use coordinates from Redux if available
      if (latitude && longitude && radius) {
        params.latitude = latitude;
        params.longitude = longitude;
        params.radius = radius;
      } else if (city && city !== 'Loading...') { // Fallback to city string if coordinates are not available
        params.location = city;
      }

      if (activeDateRange?.startDate) params.date = activeDateRange.startDate; // Assuming search by start date

      console.log('SearchResultsScreen: Calling searchListings with params:', params); // Log outgoing params
      const fetchedListings = await ListingService.searchListings(params);
      setResults(fetchedListings);
      console.log('SearchResultsScreen: Results state updated with:', fetchedListings); // Log updated results
    } catch (error: any) {
      console.error('Error performing search:', error);
      Alert.alert('Error', 'Failed to perform search. Please try again.');
      setResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (listing: Listing) => { // Change parameter type to Listing
    // Navigate to listing detail screen
    navigation.navigate('ListingDetail', { listingId: listing._id });
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (newLocation: string) => {
    // This function might need to be updated to dispatch setLocation to Redux
    // For now, it just updates local state and triggers a search
    // If you want to update Redux, you'd dispatch setLocation here
    // dispatch(setLocation({ latitude: newLat, longitude: newLon, city: newLocation }));
    // For now, we'll just update the local state for the modal display
    // and rely on Redux for the actual search params.
    // setCurrentLocation(newLocation); // This state is no longer used for search params
    setShowLocationModal(false);
  };

  const formatDateRange = () => {
    if (!activeDateRange?.startDate || !activeDateRange?.endDate) {
      return 'Immediate';
    }
    const start = new Date(activeDateRange.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const end = new Date(activeDateRange.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  const renderListingItem = ({ item }: { item: Listing }) => ( // Change render item to Listing
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        width: (screenWidth - SPACING.MD * 3) / 2, // Calculate width for two columns
        marginBottom: SPACING.MD, // Add margin bottom for spacing between rows
        marginHorizontal: SPACING.XS, // Add horizontal margin for spacing between columns
      }}
    >
      <ListingCard 
        listing={item} 
        onPress={() => handleCategoryPress(item)} // Pass listing to handleCategoryPress
      />
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Recent Searches - Keep if still relevant, otherwise remove */}
      {search.length < 3 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentTags}>
            {/* You might want to store and display actual recent searches */}
            {/* For now, keeping mock data or removing if not needed */}
            {['Tractor rental near me', 'Harvest workers'].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentTag}
                onPress={() => setSearch(item)}
              >
                <Ionicons name="time-outline" size={14} color={COLORS.TEXT.SECONDARY} />
                <Text style={styles.recentTagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {search.length >= 3 || categoryId || (latitude && longitude) ? 'Search Results' : 'Popular Listings'}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY.MAIN} />
        ) : (
          <Text style={styles.resultCount}>
            {results.length} results found
          </Text>
        )}
      </View>
    </View>
  );

  const LocationModal = () => (
    <Modal
      visible={showLocationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowLocationModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowLocationModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.TEXT.PRIMARY} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationSearchBar}>
            <Ionicons name="search" size={20} color={COLORS.TEXT.SECONDARY} />
            <TextInput
              style={styles.locationSearchInput}
              placeholder="Search for area, city..."
              placeholderTextColor={COLORS.TEXT.SECONDARY}
              value={locationSearch}
              onChangeText={setLocationSearch}
            />
          </View>
          
          <ScrollView style={styles.locationList}>
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() => handleLocationSelect('Current Location')}
            >
              <MaterialIcons name="my-location" size={20} color={COLORS.PRIMARY.MAIN} />
              <Text style={styles.locationItemText}>Use Current Location</Text>
            </TouchableOpacity>
            
            {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata'].map((locCity) => (
              <TouchableOpacity
                key={locCity}
                style={styles.locationItem}
                onPress={() => handleLocationSelect(locCity)}
              >
                <Ionicons name="location-outline" size={20} color={COLORS.TEXT.SECONDARY} />
                <Text style={styles.locationItemText}>{locCity}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
          
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color={COLORS.TEXT.SECONDARY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find Services or Listings"
              placeholderTextColor={COLORS.TEXT.SECONDARY}
              value={search}
              onChangeText={setSearch}
              autoFocus={false}
              onSubmitEditing={performSearch} // Trigger search on submit
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.TEXT.SECONDARY} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Location Bar */}
        <TouchableOpacity
          style={styles.locationBar}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.TEXT.SECONDARY} />
          <Text style={styles.locationText}>{city?.toUpperCase() || 'LOCATION UNAVAILABLE'}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.TEXT.SECONDARY} />
        </TouchableOpacity>
        
        {/* Date Range Info */}
        {activeDateRange && (
          <View style={styles.dateRangeBar}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.PRIMARY.MAIN} />
            <Text style={styles.dateRangeText}>
              Available: {formatDateRange()}
            </Text>
          </View>
        )}
        
        {/* Results */}
        {loading && results.length === 0 ? ( // Show loading only if no results yet
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderListingItem} // Change render item to Listing
            keyExtractor={(item) => item._id} // Use _id for key
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={!loading ? ( // Show "No results" only if not loading and no results
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No listings found for your search criteria.</Text>
              </View>
            ) : null}
          />
        )}
        
        {/* Location Modal */}
        <LocationModal />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  backButton: {
    padding: SPACING.SM,
    marginRight: SPACING.SM,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.SM,
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  locationText: {
    flex: 1,
    marginLeft: SPACING.SM,
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.PRIMARY,
  },
  dateRangeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  dateRangeText: {
    marginLeft: SPACING.SM,
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.PRIMARY.MAIN,
  },
  headerSection: {
    paddingHorizontal: SPACING.MD,
  },
  recentSection: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.SM,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  recentTagText: {
    marginLeft: SPACING.XS,
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
  },
  resultCount: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  gridContainer: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  row: {
    justifyContent: 'space-between',
  },
  // Removed categoryCard, categoryIconWrapper, categoryIcon, categoryName, categoryCount
  // as they are now handled by ListingCard
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['4XL'],
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  modalTitle: {
    fontSize: FONT_SIZES.LG,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
  },
  locationSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.MD,
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
  },
  locationSearchInput: {
    flex: 1,
    marginLeft: SPACING.SM,
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  locationList: {
    maxHeight: 400,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  locationItemText: {
    marginLeft: SPACING.MD,
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
});

export default SearchResultsScreen;

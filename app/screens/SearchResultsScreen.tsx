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
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import categoryIcons from '../utils/icons';

const { width: screenWidth } = Dimensions.get('window');

interface RouteParams {
  searchQuery: string;
  location: string;
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  };
}

interface SearchCategory {
  id: string;
  name: string;
  icon: string;
  count?: number;
  type: 'category' | 'listing';
}

// Mock data - replace with API data later
const popularCategories: SearchCategory[] = [
  { id: '1', name: 'Farm Machinery', icon: 'tractor', count: 245, type: 'category' },
  { id: '2', name: 'Tools & Equipment', icon: 'tools', count: 189, type: 'category' },
  { id: '3', name: 'Farm Workers', icon: 'farmer', count: 342, type: 'category' },
  { id: '4', name: 'Transport Services', icon: 'transport', count: 156, type: 'category' },
  { id: '5', name: 'Storage Solutions', icon: 'storage', count: 78, type: 'category' },
  { id: '6', name: 'Irrigation Systems', icon: 'drip', count: 92, type: 'category' },
  { id: '7', name: 'Seeds & Fertilizers', icon: 'grain', count: 267, type: 'category' },
  { id: '8', name: 'Dairy Products', icon: 'dairy', count: 134, type: 'category' },
];

const recentSearches = [
  'Tractor rental near me',
  'Harvest workers',
  'Cold storage facilities',
  'Organic fertilizers',
];

const SearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { searchQuery, location, dateRange } = route.params as RouteParams;
  
  const [search, setSearch] = useState(searchQuery || '');
  const [currentLocation, setCurrentLocation] = useState(location || 'Loading...');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [results, setResults] = useState<SearchCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Get date range from Redux if not passed
  const reduxDateRange = useSelector((state: RootState) => state.dateRange);
  const activeDateRange = dateRange || reduxDateRange;

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
    
    // Perform initial search
    performSearch();
  }, []);

  useEffect(() => {
    if (search.length >= 3) {
      performSearch();
    }
  }, [search]);

  const performSearch = async () => {
    setLoading(true);
    // Simulate API call - replace with actual API
    setTimeout(() => {
      // Filter results based on search query
      const filtered = popularCategories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : popularCategories);
      setLoading(false);
    }, 800);
  };

  const handleCategoryPress = (category: SearchCategory) => {
    // Navigate to category listings
    navigation.navigate('CategoryBrowser', { 
      selectedCategoryId: category.id,
      searchQuery: search,
      dateRange: activeDateRange,
    });
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (newLocation: string) => {
    setCurrentLocation(newLocation);
    setShowLocationModal(false);
    // Refresh search with new location
    performSearch();
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

  const renderCategoryItem = ({ item }: { item: SearchCategory }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryIconWrapper}>
          <Image
            source={categoryIcons[item.icon] || categoryIcons['tools']}
            style={styles.categoryIcon}
          />
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.count && (
          <Text style={styles.categoryCount}>
            {item.count} listings
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Recent Searches */}
      {search.length < 3 && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentTags}>
            {recentSearches.map((item, index) => (
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
          {search.length >= 3 ? 'Search Results' : 'Popular Categories'}
        </Text>
        {search.length >= 3 && (
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
            
            {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata'].map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.locationItem}
                onPress={() => handleLocationSelect(city)}
              >
                <Ionicons name="location-outline" size={20} color={COLORS.TEXT.SECONDARY} />
                <Text style={styles.locationItemText}>{city}</Text>
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
              placeholder="Find Serivces or Listings"
              placeholderTextColor={COLORS.TEXT.SECONDARY}
              value={search}
              onChangeText={setSearch}
              autoFocus={false}
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
          <Text style={styles.locationText}>{currentLocation}</Text>
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
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
  categoryCard: {
    width: (screenWidth - SPACING.MD * 3) / 2,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  categoryIconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.XS,
  },
  categoryCount: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
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
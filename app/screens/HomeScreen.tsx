import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  Dimensions,
  AppState
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LocationService from '../services/locationService';


import SmartDatePicker from '../components/SmartDatePicker';
import ExpandableSearchFilter from '../components/ExpandableSearchFilter';
import CatalogueService from '../services/CatalogueService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDate } from '../store/slices/dateRangeSlice';

import categoryIcons from '../utils/icons';

const { width: screenWidth } = Dimensions.get('window');

const tractorIcon = require('../assets/tractor.png');
const ploughingIcon = require('../assets/plough.png');
const seedSowingIcon = require('../assets/seed.png');
const dripIrrigationIcon = require('../assets/drip.png');
const mechanicalIcon = require('../assets/mechanical.png');
const farmerIcon = require('../assets/farmer.png');
const backgroundImg = require('../assets/provider-bg.png');

interface Category {
  _id: string;
  name: string;
  description: string;
  category: string;
  transactionType: string;
  parentId: string | null;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const iconMapping: { [key: string]: string } = {
  'farm_machinery': 'construct-outline',
  'specialist': 'person-outline',
  'tools': 'hammer-outline',
  'storage': 'cube-outline',
  'event': 'calendar-outline',
  'produce': 'leaf-outline',
  'transport': 'car-outline',
  'default': 'ellipse-outline'
};

const animatedPlaceholders = [
  'tractor',
  'seed sowing',
  'ploughing',
  'drip irrigation',
];

const INITIAL_HEADER_HEIGHT = 140;
const SEARCH_BAR_HEIGHT = 56;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const [searchText, setSearchText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const placeholderAnim = useRef(new Animated.Value(1)).current;
  const headerHeightAnim = useRef(new Animated.Value(INITIAL_HEADER_HEIGHT)).current;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDatePickerExpanded, setIsDatePickerExpanded] = useState(false);
  
  const dispatch = useDispatch();
  
  // Get date range from Redux
  const { date, startDate, endDate } = useSelector((state: RootState) => state.date);

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location?.city?.toUpperCase() || 'LOCATION UNAVAILABLE');
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await CatalogueService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterToggle = (expanded: boolean, filterContentHeight: number) => {
    const targetHeaderHeight = expanded
      ? INITIAL_HEADER_HEIGHT + filterContentHeight
      : INITIAL_HEADER_HEIGHT;

    Animated.timing(headerHeightAnim, {
      toValue: targetHeaderHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };



  

  const searchBarTop = headerHeightAnim.interpolate({
    inputRange: [INITIAL_HEADER_HEIGHT, 1000],
    outputRange: [INITIAL_HEADER_HEIGHT - SEARCH_BAR_HEIGHT / 2, 1000 - SEARCH_BAR_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  // Handle search submission
  const handleSearch = () => {
    navigation.navigate('SearchResults', {
      searchQuery: searchText,
      location: currentLocation,
      date: date,
      startDate: startDate,
      endDate: endDate,
    });
  };

  // Handle category selection
  const handleCategoryPress = (category: Category) => {
    navigation.navigate('SearchResults', {
      searchQuery: category.name,
      location: currentLocation,
      date: date,
      startDate: startDate,
      endDate: endDate,
    });
  };

  // Handle search bar tap
  const handleSearchBarPress = () => {
    navigation.navigate('SearchResults', {
      searchQuery: searchText,
      location: currentLocation,
      date: date,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" style={{ flex: 1 }}>
      <Image source={backgroundImg} style={styles.backgroundImage} resizeMode="cover" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View style={[styles.headerContainer, { height: headerHeightAnim }]}>
          <View style={styles.headerBackground} />
          
          {/* Light Green Circles Pattern */}
          <View style={styles.headerCircle1} />
          <View style={styles.headerCircle2} />
          <View style={styles.headerCircle3} />
          
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.locationWrapper}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>{currentLocation}</Text>
                  <Ionicons name="location" size={16} color="white" style={styles.locationIcon} />
                </View>
              </View>
            </View>
            
          </View>
          <ExpandableSearchFilter onToggleExpand={(expanded, height) => handleFilterToggle(expanded, height)} />
        </Animated.View>

        <Animated.View style={[styles.searchContainer, { top: searchBarTop }]}>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={handleSearchBarPress}
            activeOpacity={0.95}
          >
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder=" "
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {!searchText && (
              <View style={styles.animatedPlaceholderContainer}>
                <Text style={styles.animatedPlaceholder}>Search for </Text>
                <Animated.Text style={[styles.animatedPlaceholder, { opacity: placeholderAnim }]}>
                  {animatedPlaceholders[placeholderIndex]}
                </Animated.Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={[styles.servicesSection, { marginTop: SEARCH_BAR_HEIGHT + 10 }]}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScrollContent}>
            {categories.slice(0, 4).map(category => (
              <TouchableOpacity
                key={category._id}
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CategoryBrowser', { selectedCategoryId: category._id })}
              >
                <View style={styles.serviceIconWrapper}>
                  <Image source={categoryIcons[category.icon]} style={styles.serviceIcon} />
                </View>
                <Text style={styles.serviceLabel} numberOfLines={2}>{category.name}</Text>
              </TouchableOpacity>
            ))}
            {categories.length > 4 && (
              <TouchableOpacity 
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CategoryBrowser')}
              >
                <View style={styles.serviceIconWrapper}>
                  <Ionicons name="ellipsis-horizontal-circle-outline" size={32} color={COLORS.PRIMARY.MAIN} />
                </View>
                <Text style={styles.serviceLabel} numberOfLines={2}>More</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

       <View style={styles.ctaSection}>
        <Text style={styles.quickServicesTitle}>Quick Services</Text>
        <View style={styles.ctaCardsRow}>
          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.8}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Need mechanical{
}help?</Text>
              <Text style={styles.ctaSubtitle}>Find nearby{
}tractor</Text>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
                <Text style={styles.ctaButtonText}>Explore</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY.MAIN} />
              </TouchableOpacity>
            </View>
            <Image source={mechanicalIcon} style={styles.ctaImage} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.8}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Need workers?</Text>
              <Text style={styles.ctaSubtitle}>Hire farm labor</Text>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
                <Text style={styles.ctaButtonText}>Explore</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY.MAIN} />
              </TouchableOpacity>
            </View>
            <Image source={farmerIcon} style={styles.ctaImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
}


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    width: '100%',
    height: 400,
    opacity: 0.5,
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  // Light Green Circle Patterns
  headerCircle1: {
    position: 'absolute',
    right: -80,
    top: -40,
    width: 250,
    height: 250,
    backgroundColor: 'rgba(144, 238, 144, 0.15)', // Light green with transparency
    borderRadius: 125,
  },
  headerCircle2: {
    position: 'absolute',
    left: -100,
    top: 50,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(152, 251, 152, 0.1)', // Another shade of light green
    borderRadius: 100,
  },
  headerCircle3: {
    position: 'absolute',
    right: 40,
    bottom: -60,
    width: 150,
    height: 150,
    backgroundColor: 'rgba(144, 238, 144, 0.12)', // Light green
    borderRadius: 75,
  },
  headerContent: {
    paddingHorizontal: SPACING.MD,
    paddingTop: Platform.OS === 'ios' ? SPACING.MD : SPACING.LG,
    position: 'relative',
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationWrapper: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'white',
    fontFamily: FONTS.POPPINS.SEMIBOLD,
  },
  locationIcon: {
    marginLeft: 6,
  },
  searchContainer: {
    position: 'absolute',
    left: SPACING.MD,
    right: SPACING.MD,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    gap: SPACING.SM,
    ...SHADOWS.LG,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
    padding: 0,
  },
  animatedPlaceholderContainer: {
    position: 'absolute',
    left: 52,
    top: Platform.OS === 'ios' ? 16 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  animatedPlaceholder: {
    color: COLORS.TEXT.PLACEHOLDER,
    fontFamily: FONTS.POPPINS.REGULAR,
    fontSize: 12,
  },
  servicesSection: {
    paddingLeft: SPACING.SM,
    paddingRight: SPACING.SM,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.MD,
  },
  servicesScrollContent: {
    paddingRight: SPACING.SM,
    gap: SPACING.SM,
  },
  serviceCard: {
    alignItems: 'center',
    marginRight: SPACING.SM,
    minWidth: 90,
    maxWidth: 90,
  },
  serviceIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.XS,
    ...SHADOWS.SM,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  serviceLabel: {
    fontSize: 11,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.PRIMARY,
    textAlign: 'center',
    lineHeight: 14,
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 4,
  },
  ctaSection: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.XL,
  },
  quickServicesTitle: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.MD,
  },
  ctaCardsRow: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  ctaCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.LG,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.MD,
  },
  ctaContent: {
    flex: 1,
    zIndex: 1,
  },
  ctaTitle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.BOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.XS,
    lineHeight: 22,
  },
  ctaSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: COLORS.SECONDARY.LIGHT,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.XS,
  },
  ctaButtonText: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.PRIMARY.MAIN,
  },
  ctaImage: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 90,
    height: 90,
    opacity: 0.9,
  },
  ctaIconWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY.LIGHT,
    borderRadius: BORDER_RADIUS.LG,
  },
});
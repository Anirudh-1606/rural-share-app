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
  Dimensions 
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LocationService from '../services/locationService';

const { width: screenWidth } = Dimensions.get('window');

const tractorIcon = require('../assets/tractor.png');
const ploughingIcon = require('../assets/plough.png');
const seedSowingIcon = require('../assets/seed.png');
const dripIrrigationIcon = require('../assets/drip.png');
const harvestIcon = require('../assets/harvest.png');
const backgroundImg = require('../assets/provider-bg.png');

const exploreItems = [
  { icon: tractorIcon, label: 'Tractor' },
  { icon: ploughingIcon, label: 'Ploughing' },
  { icon: seedSowingIcon, label: 'Seed Sowing' },
  { icon: dripIrrigationIcon, label: 'Drip Irrigation' },
];

const animatedPlaceholders = [
  'tractor',
  'seed sowing',
  'ploughing',
  'drip irrigation',
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const [searchText, setSearchText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const placeholderAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Get current location
    const fetchLocation = async () => {
      const location = await LocationService.getCurrentLocation();
      if (location && location.city) {
        setCurrentLocation(location.city.toUpperCase());
      } else {
        setCurrentLocation('LOCATION UNAVAILABLE');
      }
    };
    fetchLocation();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animate placeholder text
    const interval = setInterval(() => {
      Animated.timing(placeholderAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % animatedPlaceholders.length);
        Animated.timing(placeholderAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [fadeAnim, placeholderAnim]);

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" style={{ flex: 1 }}>
      {/* Background Image */}
      <Image 
        source={backgroundImg} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBackground}>
            <View style={styles.headerCircle1} />
            <View style={styles.headerCircle2} />
          </View>
          
          <View style={styles.headerContent}>
            {/* Location and Profile Row */}
            <View style={styles.headerTop}>
              <View style={styles.locationWrapper}>
                <Text style={styles.locationLabel}>Location</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>{currentLocation}</Text>
                  <Ionicons name="location" size={16} color="white" style={styles.locationIcon} />
                </View>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={24} color={COLORS.PRIMARY.MAIN} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Floating Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder=" "
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
              />
              {!searchText && (
                <View style={styles.animatedPlaceholderContainer}>
                  <Text style={styles.animatedPlaceholder}>Search for </Text>
                  <Animated.Text
                    style={[
                      styles.animatedPlaceholder,
                      { opacity: placeholderAnim },
                    ]}
                  >
                    {animatedPlaceholders[placeholderIndex]}
                  </Animated.Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Services Section */}
        <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Explore Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollContent}
          >
            {exploreItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => {}}
              >
                <View style={styles.serviceIconWrapper}>
                  <Image source={item.icon} style={styles.serviceIcon} resizeMode="contain" />
                </View>
                <Text style={styles.serviceLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* CTA Cards */}
        <View style={styles.ctaSection}>
          {/* Mechanical Services Card */}
          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.8}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Need mechanical services?</Text>
              <Text style={styles.ctaSubtitle}>At your ease</Text>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
                <Text style={styles.ctaButtonText}>Check Now</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY.MAIN} />
              </TouchableOpacity>
            </View>
            <View style={styles.ctaImageWrapper}>
              <Image source={harvestIcon} style={styles.ctaImage} resizeMode="contain" />
            </View>
          </TouchableOpacity>

          {/* Human Resources Card */}
          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.8}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Need human resources?</Text>
              <Text style={styles.ctaSubtitle}>Find workers nearby</Text>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
                <Text style={styles.ctaButtonText}>Check Now</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY.MAIN} />
              </TouchableOpacity>
            </View>
            <View style={styles.ctaIconWrapper}>
              <Ionicons name="people" size={60} color={COLORS.PRIMARY.MAIN} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
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
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 400,
    opacity: 0.5,
  },
  // Header Styles
  headerContainer: {
    height: 170,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: COLORS.PRIMARY.MAIN,
    overflow: 'hidden',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
  },
  headerCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 125,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationWrapper: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: FONTS.POPPINS.REGULAR,
    marginBottom: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    fontFamily: FONTS.POPPINS.SEMIBOLD,
  },
  locationIcon: {
    marginLeft: 6,
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  // Search Bar Styles
  searchContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -28,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    ...SHADOWS.LG,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
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
    color: '#94a3b8',
    fontFamily: FONTS.POPPINS.REGULAR,
    fontSize: 15,
  },
  // Services Section
  servicesSection: {
    paddingLeft: 20,
    marginTop: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 16,
  },
  servicesScrollContent: {
    paddingRight: 20,
  },
  serviceCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  serviceIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFC06E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    width: 45,
    height: 45,
  },
  serviceLabel: {
    fontSize: 12,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#475569',
    textAlign: 'center',
  },
  // CTA Section
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 16,
  },
  ctaCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.MD,
    position: 'relative',
    overflow: 'hidden',
  },
  ctaContent: {
    flex: 1,
    zIndex: 2,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: FONTS.POPPINS.BOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 4,
    lineHeight: 26,
  },
  ctaSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#64748b',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: COLORS.SECONDARY.LIGHT,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  ctaButtonText: {
    fontSize: 13,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.PRIMARY.MAIN,
  },
  ctaImageWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  ctaImage: {
    width: 100,
    height: 100,
  },
  ctaIconWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY.LIGHT,
    borderRadius: 20,
  },
  // Decorative background for CTA
  ctaDecoration: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(45, 122, 78, 0.05)',
    borderRadius: 100,
  },
});
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LocationService from '../services/locationService';

const tractorIcon = require('../assets/tractor.png');
const ploughingIcon = require('../assets/plough.png');
const seedSowingIcon = require('../assets/seed.png');
const dripIrrigationIcon = require('../assets/drip.png');
const harvestIcon = require('../assets/harvest.png');

const exploreIcons = [
  tractorIcon,
  ploughingIcon,
  seedSowingIcon,
  dripIrrigationIcon,
];

const exploreLabels = [
  'Tractor',
  'Ploughing',
  'Seed Sowing',
  'Drip Irrigation',
];

const animatedPlaceholders = [
  'tractor',
  'seed sowing',
  'ploughing',
  'drip irrigation',
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

    // Animate placeholder text
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % animatedPlaceholders.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.locationContainer}>
            <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={styles.locationLabel}>
              Location
            </Text>
            <View style={styles.locationInfo}>
              <Text variant="body" weight="bold" style={styles.locationCity}>
                {currentLocation}
              </Text>
              <Ionicons name="location-outline" size={16} color={COLORS.TEXT.SECONDARY} style={styles.locationIcon} />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color={COLORS.PRIMARY.MAIN} />
          </TouchableOpacity>
        </View>

        {/* Explore More */}
        <Text variant="body" weight="semibold" color={COLORS.TEXT.SECONDARY} style={styles.exploreLabel}>
          Explore
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exploreScroll}>
          {exploreIcons.map((icon, idx) => (
            <View key={idx} style={styles.exploreItem}>
              <View style={styles.exploreIconWrap}>
                <Image source={icon} style={styles.exploreIcon} resizeMode="contain" />
              </View>
              <Text variant="caption" align="center" style={styles.exploreText}>
                {exploreLabels[idx]}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.exploreMoreBtn}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
          </TouchableOpacity>
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.TEXT.PLACEHOLDER} style={styles.searchIcon} />
          <TextInput
            placeholder=" "
            placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
            style={styles.searchInput}
          />
          <View style={styles.animatedPlaceholderContainer}>
            <Text style={styles.animatedPlaceholder}>Search for </Text>
            <Animated.Text
              style={[
                styles.animatedPlaceholder,
                { opacity: fadeAnim },
              ]}
            >
              {animatedPlaceholders[placeholderIndex]}
            </Animated.Text>
          </View>
        </View>

        {/* Mechanical Services Card */}
        <TouchableOpacity style={styles.cardGreenRow} activeOpacity={0.8}>
          <View style={styles.cardContent}>
            <Text variant="h4" weight="bold" style={styles.cardTitle}>
              Need mechanical services?
            </Text>
            <Text variant="body" color={COLORS.PRIMARY.MAIN} style={styles.cardSubtitle}>
              At your ease
            </Text>
            <View style={styles.checkNowBtn}>
              <Text variant="body" weight="semibold" color={COLORS.PRIMARY.MAIN}>
                Check Now
              </Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.PRIMARY.MAIN} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Image source={harvestIcon} style={styles.cardImage} resizeMode="contain" />
        </TouchableOpacity>

        {/* Human Resources Card */}
        <TouchableOpacity style={styles.cardWhiteRow} activeOpacity={0.8}>
          <View style={styles.cardContent}>
            <Text variant="h4" weight="bold" style={styles.cardTitle}>
              Need human resources?
            </Text>
            <Text variant="body" color={COLORS.PRIMARY.MAIN} style={styles.cardSubtitle}>
              Find workers nearby
            </Text>
            <View style={styles.checkNowBtn}>
              <Text variant="body" weight="semibold" color={COLORS.PRIMARY.MAIN}>
                Check Now
              </Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.PRIMARY.MAIN} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Ionicons name="people-outline" size={80} color={COLORS.PRIMARY.MAIN} style={styles.cardIconLarge} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.LG,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    marginBottom: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationCity: {
    fontSize: 16,
  },
  locationIcon: {
    marginLeft: 4,
  },
  profileButton: {
    padding: SPACING.XS,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM + 2,
    marginBottom: SPACING.LG,
    ...SHADOWS.SM,
  },
  searchIcon: {
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT.PRIMARY,
    fontFamily: FONTS.POPPINS.MEDIUM,
    padding: 0,
    margin: 0,
  },
  animatedPlaceholderContainer: {
    position: 'absolute',
    left: SPACING.MD + 28,
    top: Platform.OS === 'ios' ? 11 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  animatedPlaceholder: {
    color: COLORS.TEXT.PLACEHOLDER,
    fontFamily: FONTS.POPPINS.MEDIUM,
    fontSize: 15,
  },
  cardGreenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.HIGHLIGHT,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    ...SHADOWS.MD,
  },
  cardWhiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    ...SHADOWS.MD,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {

    fontFamily: FONTS.POPPINS.REGULAR,
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT.PRIMARY,
  },
  cardSubtitle: {
    marginBottom: SPACING.SM,
    fontWeight: '500',
  },
  cardImage: {
    width: 90,
    height: 100,
  
  },
  cardIconLarge: {
    marginLeft: SPACING.SM,
  },
  checkNowBtn: {
    backgroundColor: COLORS.SECONDARY.LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreLabel: {
    marginBottom: SPACING.SM,
    marginTop: SPACING.XS,
    fontFamily: FONTS.POPPINS.BOLD,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT.PLACEHOLDER,
  },
  exploreScroll: {
    marginBottom: SPACING.LG,
  },
  exploreItem: {
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  exploreIconWrap: {
    backgroundColor: COLORS.BACKGROUND.HIGHLIGHT,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.XS,
  },
  exploreIcon: {
    width: 40,
    height: 40,
  },
  exploreText: {
    marginTop: 2,
  },
  exploreMoreBtn: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.FULL,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    ...SHADOWS.SM,
  },
});
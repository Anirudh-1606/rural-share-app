import React from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const tractorIcon = require('../assets/tractor.png');
const ploughingIcon = require('../assets/plough.png');
const seedSowingIcon = require('../assets/seed.png');
const dripIrrigationIcon = require('../assets/drip.png');

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

export default function HomeScreen() {
  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Location */}
        <View style={styles.locationRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="label" color={COLORS.TEXT.SECONDARY} style={styles.locationLabel}>
              Location
            </Text>
            <Ionicons name="location-outline" size={18} color={COLORS.TEXT.SECONDARY} />
          </View>
          <Ionicons name="person-outline" size={36} color={COLORS.PRIMARY.MAIN} style={styles.avatarIcon} />
        </View>
        <Text variant="label" weight="bold" style={styles.locationCity}>
          HYDERABAD
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.TEXT.PLACEHOLDER} style={{ marginRight: 8 } } />
          <TextInput
            placeholder="Search for tractor"
            placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
            style={styles.searchInput}
          />
        </View>

        {/* Mechanical Services Card */}
        <View style={styles.cardGreenRow}>
          <View style={{ flex: 1 }}>
            <Text variant="h4" weight="bold" style={{ marginBottom: 2, fontFamily: 'Poppins-Regular',fontWeight: '700',fontSize: 18 }}>
              Need mechanical services?
            </Text>
            <Text color={COLORS.PRIMARY.MAIN} style={{ marginBottom: 10,fontFamily: 'Poppins-Regular',fontWeight: '400',fontSize: 16 }}>
              At your ease
            </Text>
            <TouchableOpacity style={styles.checkNowBtn}>
              <Text weight="medium" color={COLORS.PRIMARY.MAIN}>Check Now {'>'}</Text>
            </TouchableOpacity>
          </View>
          <Image source={tractorIcon} style={styles.cardImage} resizeMode="contain" />
        </View>

        {/* Explore More */}
        <Text variant="body" color={COLORS.TEXT.SECONDARY} style={styles.exploreLabel}>
          Explore 
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exploreScroll}>
          {exploreIcons.map((icon, idx) => (
            <View key={idx} style={styles.exploreItem}>
              <View style={styles.exploreIconWrap}>
                {idx === 0 ? (
                  <Image source={icon} style={styles.exploreIcon} resizeMode="contain" />
                ) : (
                  icon
                )}
              </View>
              <Text variant="label" align="center" style={styles.exploreText}>{exploreLabels[idx]}</Text>
            </View>
          ))}
          <View style={styles.exploreMoreBtn}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
          </View>
        </ScrollView>

        {/* Become a Provider Card */}
        <View style={styles.cardGreenRow}>
          <View style={{ flex: 1 }}>
            <Text variant="h4" weight="bold" style={{ marginBottom: 2 }}>
              Become a provider
            </Text>
            <Text color={COLORS.PRIMARY.MAIN} style={{ marginBottom: 10 }}>
              get started
            </Text>
          </View>
          <Ionicons name="person-add-outline" size={60} color={COLORS.PRIMARY.MAIN} style={styles.cardImage} />
        </View>

        {/* Human Resources Card */}
        <View style={styles.cardWhiteRow}>
          <View style={{ flex: 1 }}>
            <Text variant="h4" weight="bold" style={{ marginBottom: 2 }}>
              Need human resources?
            </Text>
            <Text color={COLORS.PRIMARY.MAIN} style={{ marginBottom: 10 }}>
              find workers nearby
            </Text>
            <TouchableOpacity style={styles.checkNowBtn}>
              <Text weight="medium" color={COLORS.PRIMARY.MAIN}>Check Now {'>'}</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="man-outline" size={60} color={COLORS.PRIMARY.MAIN} style={styles.cardImage} />
        </View>
      </ScrollView>

     
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  locationLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  locationCity: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT.PRIMARY,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
  },
  cardGreenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.HIGHLIGHT,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: COLORS.SHADOW.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardWhiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: COLORS.SHADOW.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  checkNowBtn: {
    backgroundColor: COLORS.SECONDARY.LIGHT,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontSize: 14,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  exploreLabel: {
    marginBottom: 10,
    marginTop: 2,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  },
  exploreScroll: {
    marginBottom: 18,
  },
  exploreItem: {
    alignItems: 'center',
    marginRight: 18,
  },
  exploreIconWrap: {
    backgroundColor: COLORS.BACKGROUND.HIGHLIGHT,
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  exploreIcon: {
    width: 36,
    height: 36,
  },
  exploreText: {
    fontSize: 13,
    marginTop: 2,
  },
  exploreMoreBtn: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.NAV,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: COLORS.SHADOW.PRIMARY,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    flex: 1,
  },
  avatarIcon: {
    marginLeft: 8,
  },
});

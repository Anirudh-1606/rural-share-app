import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SingleImagePicker from '../components/SingleImagePicker';
import { ImagePickerResult } from '../services/ImagePickerService';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

type ProfileSectionItem = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
};

type ProfileSection = {
  title: string;
  items: ProfileSectionItem[];
};

const ProfileScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const [defaultTab, setDefaultTab] = useState<'seeker' | 'provider'>('seeker');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<ImagePickerResult | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleTabPreferenceChange = async (tab: 'seeker' | 'provider') => {
    setDefaultTab(tab);
    await AsyncStorage.setItem('defaultTab', tab);
  };

  const profileSections: ProfileSection[] = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
        { icon: 'call-outline', label: 'Phone Number', value: user?.phone || 'N/A' },
        { icon: 'mail-outline', label: 'Email', value: user?.email || 'N/A' },
        { icon: 'location-outline', label: 'Address', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'language-outline', label: 'Language', value: 'English', onPress: () => {} },
        { icon: 'moon-outline', label: 'Dark Mode', toggle: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', onPress: () => {} },
        { icon: 'chatbubble-outline', label: 'Contact Us', onPress: () => {} },
        { icon: 'document-text-outline', label: 'Terms & Conditions', onPress: () => {} },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={80} color={COLORS.PRIMARY.MAIN} />
            )}
            <SingleImagePicker
              onImageSelected={(image) => setProfileImage(image)}
              placeholder=""
              showPreview={false}
              style={styles.imagePickerOverlay}
            />
          </View>
          <Text style={styles.userName}>
            {user?.name || 'John Doe'}
          </Text>
          <Text style={styles.userRole}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Rural Service Provider'}
          </Text>
        </View>

        {/* Default Tab Preference */}
         <View style={styles.preferenceCard}>
          <Text style={styles.preferenceTitle}>
            Default Landing Page
          </Text>
          <Text style={styles.preferenceDescription}>
            Choose which page to show when you open the app
          </Text>
          
          <View style={styles.tabOptions}>
            <TouchableOpacity
              style={[styles.tabOption, defaultTab === 'seeker' && styles.tabOptionActive]}
              onPress={() => handleTabPreferenceChange('seeker')}
            >
              <View style={styles.tabOptionContent}>
                <Ionicons 
                  name="search-outline" 
                  size={20} 
                  color={defaultTab === 'seeker' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY} 
                  style={styles.tabOptionIcon}
                />
                <View style={styles.tabOptionTextContainer}>
                  <Text 
                    style={[
                      styles.tabOptionText,
                      defaultTab === 'seeker' && styles.tabOptionTextActive
                    ]}
                  >
                    Service Seeker
                  </Text>
                  <Text style={styles.tabOptionSubtext}>
                    Find services & equipment
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabOption, defaultTab === 'provider' && styles.tabOptionActive]}
              onPress={() => handleTabPreferenceChange('provider')}
            >
              <View style={styles.tabOptionContent}>
                <Ionicons 
                  name="briefcase-outline" 
                  size={20} 
                  color={defaultTab === 'provider' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY} 
                  style={styles.tabOptionIcon}
                />
                <View style={styles.tabOptionTextContainer}>
                  <Text 
                    style={[
                      styles.tabOptionText,
                      defaultTab === 'provider' && styles.tabOptionTextActive
                    ]}
                  >
                    Service Provider
                  </Text>
                  <Text style={styles.tabOptionSubtext}>
                    Offer your services
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>


        {/* Settings Sections */}
        {profileSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress && !item.toggle}
                >
                  <View style={styles.settingItemLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon} size={18} color={COLORS.PRIMARY.MAIN} />
                    </View>
                    <Text style={styles.settingLabel}>
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.settingItemRight}>
                    {item.value && (
                      <Text style={styles.settingValue}>
                        {item.value}
                      </Text>
                    )}
                    {item.toggle && (
                      <Switch
                        value={item.label === 'Notifications' ? notificationsEnabled : false}
                        onValueChange={(value) => {
                          if (item.label === 'Notifications') {
                            setNotificationsEnabled(value);
                          }
                        }}
                        trackColor={{ false: COLORS.NEUTRAL.GRAY[300], true: COLORS.PRIMARY.LIGHT }}
                        thumbColor={COLORS.PRIMARY.MAIN}
                      />
                    )}
                    {item.onPress && (
                      <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT.SECONDARY} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.NEUTRAL.WHITE} />
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING['4XL'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  headerTitle: {
    fontSize: FONT_SIZES.LG,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.LG,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.MD,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.FULL,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imagePickerOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderRadius: BORDER_RADIUS.FULL,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  userName: {
    fontSize: FONT_SIZES.XL,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  userRole: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
   preferenceCard: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.LG,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.SM,
  },
  preferenceTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.XS,
  },
  preferenceDescription: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    marginBottom: SPACING.MD,
  },
  tabOptions: {
    gap: SPACING.SM,
  },
  tabOption: {
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.SECONDARY,
  },
  tabOptionActive: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    borderColor: COLORS.PRIMARY.MAIN,
  },
  tabOptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tabOptionIcon: {
    marginRight: SPACING.SM,
    marginTop: 2,
  },
  tabOptionTextContainer: {
    flex: 1,
  },
  tabOptionText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  tabOptionTextActive: {
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.PRIMARY.MAIN,
  },
  tabOptionSubtext: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BASE,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  sectionCard: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    marginHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.SM,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  settingLabel: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
    flex: 1,
  },
  settingValue: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY.MAIN,
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.MD,
  },
  logoutText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.NEUTRAL.WHITE,
    marginLeft: 8,
  },
  version: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
});

export default ProfileScreen;
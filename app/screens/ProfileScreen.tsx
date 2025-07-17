import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const [defaultTab, setDefaultTab] = useState<'seeker' | 'provider'>('seeker');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleTabPreferenceChange = async (tab: 'seeker' | 'provider') => {
    setDefaultTab(tab);
    await AsyncStorage.setItem('defaultTab', tab);
  };

  const profileSections: ProfileSection[] = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
        { icon: 'call-outline', label: 'Phone Number', value: '+91 98765 43210' },
        { icon: 'mail-outline', label: 'Email', value: 'user@example.com' },
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
          <Text variant="h3" weight="bold" align="center" style={styles.headerTitle}>
            Profile
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color={COLORS.PRIMARY.MAIN} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color={COLORS.PRIMARY.MAIN} />
            </TouchableOpacity>
          </View>
          <Text variant="h3" weight="bold" align="center" style={styles.userName}>
            John Doe
          </Text>
          <Text variant="body" color={COLORS.TEXT.SECONDARY} align="center">
            Rural Service Provider
          </Text>
        </View>

        {/* Default Tab Preference */}
         <View style={styles.preferenceCard}>
          <Text variant="h4" weight="semibold" style={styles.preferenceTitle}>
            Default Landing Page
          </Text>
          <Text variant="caption" color={COLORS.TEXT.SECONDARY} style={styles.preferenceDescription}>
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
                  size={24} 
                  color={defaultTab === 'seeker' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY} 
                  style={styles.tabOptionIcon}
                />
                <View style={styles.tabOptionTextContainer}>
                  <Text 
                    variant="body" 
                    weight={defaultTab === 'seeker' ? 'semibold' : 'regular'}
                    color={defaultTab === 'seeker' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.PRIMARY}
                  >
                    Service Seeker
                  </Text>
                  <Text 
                    variant="caption" 
                    color={COLORS.TEXT.SECONDARY}
                    style={styles.tabOptionSubtext}
                  >
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
                  size={24} 
                  color={defaultTab === 'provider' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.SECONDARY} 
                  style={styles.tabOptionIcon}
                />
                <View style={styles.tabOptionTextContainer}>
                  <Text 
                    variant="body" 
                    weight={defaultTab === 'provider' ? 'semibold' : 'regular'}
                    color={defaultTab === 'provider' ? COLORS.PRIMARY.MAIN : COLORS.TEXT.PRIMARY}
                  >
                    Service Provider
                  </Text>
                  <Text 
                    variant="caption" 
                    color={COLORS.TEXT.SECONDARY}
                    style={styles.tabOptionSubtext}
                  >
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
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
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
                      <Ionicons name={item.icon} size={22} color={COLORS.PRIMARY.MAIN} />
                    </View>
                    <Text variant="body" style={styles.settingLabel}>
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.settingItemRight}>
                    {item.value && (
                      <Text variant="body" color={COLORS.TEXT.SECONDARY}>
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
                      <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.NEUTRAL.WHITE} />
          <Text variant="body" weight="semibold" color={COLORS.NEUTRAL.WHITE} style={{ marginLeft: 8 }}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text variant="caption" color={COLORS.TEXT.SECONDARY} align="center" style={styles.version}>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
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
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  userName: {
    marginBottom: SPACING.XS,
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
    marginBottom: SPACING.XS,
  },
  preferenceDescription: {
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
  tabOptionSubtext: {
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
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
    width: 40,
    height: 40,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  settingLabel: {
    flex: 1,
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
  version: {
    marginBottom: SPACING.MD,
  },
});

export default ProfileScreen;
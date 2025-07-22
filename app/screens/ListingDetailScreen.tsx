import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ListingService from '../services/ListingService';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ListingDetail {
  _id: string;
  title: string;
  description: string;
  photos: string[];
  price: number;
  unitOfMeasure: string;
  minimumOrder: number;
  isActive: boolean;
  tags: string[];
  viewCount: number;
  bookingCount: number;
  availableFrom: string;
  availableTo: string;
  createdAt: string;
  location: {
    type: string;
    coordinates: number[];
  };
  providerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  categoryId: {
    _id: string;
    name: string;
    icon: string;
  };
  subCategoryId: {
    _id: string;
    name: string;
  };
}

const ListingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { listingId } = route.params;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchListingDetail();
  }, []);

  const fetchListingDetail = async () => {
    try {
      setLoading(true);
      const response = await ListingService.getListingById(listingId);
      setListing(response);
      setEditedData({
        title: response.title,
        description: response.description,
        price: response.price.toString(),
        minimumOrder: response.minimumOrder.toString(),
        tags: [...response.tags],
        availableFrom: new Date(response.availableFrom),
        availableTo: new Date(response.availableTo),
        isActive: response.isActive,
      });
    } catch (error) {
      console.error('Error fetching listing detail:', error);
      Alert.alert('Error', 'Failed to load listing details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await ListingService.deleteListing(listingId);
              Alert.alert('Success', 'Listing deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', 'Failed to delete listing. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatePayload = {
        title: editedData.title,
        description: editedData.description,
        price: parseFloat(editedData.price),
        minimumOrder: parseInt(editedData.minimumOrder),
        tags: editedData.tags,
        availableFrom: editedData.availableFrom.toISOString().split('T')[0],
        availableTo: editedData.availableTo.toISOString().split('T')[0],
        isActive: editedData.isActive,
      };
      
      await ListingService.updateListing(listingId, updatePayload);
      Alert.alert('Success', 'Listing updated successfully');
      setIsEditMode(false);
      fetchListingDetail(); // Refresh data
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Failed to update listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (listing) {
      setEditedData({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        minimumOrder: listing.minimumOrder.toString(),
        tags: [...listing.tags],
        availableFrom: new Date(listing.availableFrom),
        availableTo: new Date(listing.availableTo),
        isActive: listing.isActive,
      });
    }
    setIsEditMode(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editedData.tags.includes(tagInput.trim())) {
      setEditedData({
        ...editedData,
        tags: [...editedData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditedData({
      ...editedData,
      tags: editedData.tags.filter((_: string, i: number) => i !== index),
    });
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!listing) return null;

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
          <Text variant="h4" weight="semibold" style={styles.headerTitle}>
            {isEditMode ? 'Edit Listing' : 'Listing Details'}
          </Text>
          {isEditMode ? (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text variant="body" weight="semibold" color={COLORS.PRIMARY.MAIN}>
                Save
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Gallery */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageGallery}
          >
            {listing.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.listingImage} />
            ))}
          </ScrollView>

          {/* Basic Info */}
          <View style={styles.section}>
            {isEditMode ? (
              <>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedData.title}
                  onChangeText={(text) => setEditedData({ ...editedData, title: text })}
                  placeholder="Enter title"
                />
              </>
            ) : (
              <Text variant="h4" weight="bold" style={styles.title}>
                {listing.title}
              </Text>
            )}

            <View style={styles.metaContainer}>
              <View style={styles.categoryBadge}>
                <Ionicons name="pricetag-outline" size={16} color={COLORS.PRIMARY.MAIN} />
                <Text variant="caption" color={COLORS.PRIMARY.MAIN} style={{ marginLeft: 4 }}>
                  {listing.categoryId.name} • {listing.subCategoryId.name}
                </Text>
              </View>
              <View style={[styles.statusBadge, !listing.isActive && styles.statusBadgeInactive]}>
                <Text variant="caption" weight="medium" color={listing.isActive ? COLORS.PRIMARY.MAIN : '#6B7280'}>
                  {listing.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>

            {isEditMode ? (
              <>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editedData.description}
                  onChangeText={(text) => setEditedData({ ...editedData, description: text })}
                  placeholder="Enter description"
                  multiline
                  numberOfLines={4}
                />
              </>
            ) : (
              <Text variant="body" color={COLORS.TEXT.SECONDARY} style={styles.description}>
                {listing.description}
              </Text>
            )}
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Pricing Details
            </Text>
            <View style={styles.pricingContainer}>
              {isEditMode ? (
                <View style={styles.editRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Price</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedData.price}
                      onChangeText={(text) => setEditedData({ ...editedData, price: text })}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.SM }}>
                    <Text style={styles.inputLabel}>Minimum Order</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedData.minimumOrder}
                      onChangeText={(text) => setEditedData({ ...editedData, minimumOrder: text })}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.priceItem}>
                    <Text variant="body" color={COLORS.TEXT.SECONDARY}>Price</Text>
                    <Text variant="h4" weight="bold" color={COLORS.PRIMARY.MAIN}>
                      ₹{listing.price}/{listing.unitOfMeasure}
                    </Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text variant="body" color={COLORS.TEXT.SECONDARY}>Minimum Order</Text>
                    <Text variant="h4" weight="semibold">
                      {listing.minimumOrder} {listing.unitOfMeasure}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Availability
            </Text>
            {isEditMode ? (
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Text variant="body" color={COLORS.TEXT.SECONDARY}>From</Text>
                  <Text variant="body">{formatDate(editedData.availableFrom)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Text variant="body" color={COLORS.TEXT.SECONDARY}>To</Text>
                  <Text variant="body">{formatDate(editedData.availableTo)}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.dateContainer}>
                <View style={styles.dateItem}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.TEXT.SECONDARY} />
                  <View style={{ marginLeft: SPACING.SM }}>
                    <Text variant="caption" color={COLORS.TEXT.SECONDARY}>From</Text>
                    <Text variant="body" weight="medium">{formatDate(listing.availableFrom)}</Text>
                  </View>
                </View>
                <View style={styles.dateItem}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.TEXT.SECONDARY} />
                  <View style={{ marginLeft: SPACING.SM }}>
                    <Text variant="caption" color={COLORS.TEXT.SECONDARY}>To</Text>
                    <Text variant="body" weight="medium">{formatDate(listing.availableTo)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Tags
            </Text>
            {isEditMode && (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add tag"
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.tagsContainer}>
              {editedData.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text variant="body" color={COLORS.PRIMARY.MAIN}>
                    {tag}
                  </Text>
                  {isEditMode && (
                    <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                      <Ionicons name="close-circle" size={18} color={COLORS.PRIMARY.MAIN} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          {!isEditMode && (
            <View style={styles.section}>
              <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                Statistics
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Ionicons name="eye-outline" size={24} color={COLORS.PRIMARY.MAIN} />
                  <Text variant="h3" weight="bold" style={styles.statValue}>
                    {listing.viewCount}
                  </Text>
                  <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
                    Views
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="calendar-check-outline" size={24} color={COLORS.PRIMARY.MAIN} />
                  <Text variant="h3" weight="bold" style={styles.statValue}>
                    {listing.bookingCount}
                  </Text>
                  <Text variant="caption" color={COLORS.TEXT.SECONDARY}>
                    Bookings
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Status Toggle in Edit Mode */}
          {isEditMode && (
            <View style={styles.section}>
              <View style={styles.statusToggleContainer}>
                <Text variant="body" weight="medium">Listing Status</Text>
                <TouchableOpacity
                  style={[
                    styles.statusToggle,
                    editedData.isActive && styles.statusToggleActive,
                  ]}
                  onPress={() => setEditedData({ ...editedData, isActive: !editedData.isActive })}
                >
                  <Text
                    variant="body"
                    weight="medium"
                    color={editedData.isActive ? '#fff' : COLORS.TEXT.SECONDARY}
                  >
                    {editedData.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Date Pickers */}
        {showFromDatePicker && (
          <DateTimePicker
            value={editedData.availableFrom}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowFromDatePicker(Platform.OS === 'ios');
              if (date) setEditedData({ ...editedData, availableFrom: date });
            }}
          />
        )}

        {showToDatePicker && (
          <DateTimePicker
            value={editedData.availableTo}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowToDatePicker(Platform.OS === 'ios');
              if (date) setEditedData({ ...editedData, availableTo: date });
            }}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {isEditMode ? (
            <>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text variant="body" weight="semibold" color={COLORS.TEXT.SECONDARY}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditMode(true)}>
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text variant="body" weight="semibold" color="#fff" style={{ marginLeft: 8 }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text variant="body" weight="semibold" color="#fff" style={{ marginLeft: 8 }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT.PRIMARY,
  },
  saveButton: {
    paddingHorizontal: SPACING.MD,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageGallery: {
    height: 250,
    backgroundColor: COLORS.BACKGROUND.CARD,
  },
  listingImage: {
    width: 375, // Adjust based on screen width
    height: 250,
    resizeMode: 'cover',
  },
  section: {
    padding: SPACING.MD,
    backgroundColor: '#fff',
    marginBottom: SPACING.SM,
  },
  title: {
    marginBottom: SPACING.SM,
    fontSize: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY.LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusBadge: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusBadgeInactive: {
    backgroundColor: COLORS.BACKGROUND.CARD,
  },
  description: {
    lineHeight: 22,
    fontSize: 14,
    color: COLORS.TEXT.SECONDARY,
  },
  sectionTitle: {
    marginBottom: SPACING.MD,
    fontSize: 16,
    // fontWeight: '600',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY.LIGHT,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.LG,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    marginVertical: SPACING.XS,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: SPACING.MD,
    gap: SPACING.SM,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER.PRIMARY,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY.MAIN,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.SM,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.SM,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND.CARD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.XS,
    marginTop: SPACING.SM,
  },
  textInput: {
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: 16,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  editRow: {
    flexDirection: 'row',
  },
  dateInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.XS,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
    gap: SPACING.SM,
  },
  addTagButton: {
    backgroundColor: COLORS.PRIMARY.MAIN,
    paddingHorizontal: SPACING.MD,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.MD,
  },
  statusToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusToggle: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.BACKGROUND.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
  },
  statusToggleActive: {
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderColor: COLORS.PRIMARY.MAIN,
  },
});

export default ListingDetailScreen;
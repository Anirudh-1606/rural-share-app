import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { checkAuth } from '../store/slices/authSlice';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CatalogueService from '../services/CatalogueService';
import ListingService from '../services/ListingService';

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

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
  description?: string;
  defaultUnitOfMeasure?: string;
  suggestedMinPrice?: number;
  suggestedMaxPrice?: number;
}

interface ListingFormData {
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  photos: string[];
  videoUrl?: string;
  coordinates: [number, number]; // [longitude, latitude]
  price: string;
  unitOfMeasure: string;
  minimumOrder: string;
  availableFrom: Date;
  availableTo: Date;
  tags: string[];
  termsAndConditions?: string;
  locationAddress: string; // To store the address string
}

// Icon mapping for categories (from existing assets/Icons/Categories and general assets)
const iconMapping: { [key: string]: string } = {
  'tractor': 'build-outline', // Example, adjust to actual Ionicons
  'water-pump': 'water-outline',
  'processor': 'cog-outline',
  'farmer': 'person-outline',
  'construction': 'construct-outline',
  'specialist': 'briefcase-outline',
  'seed-drill': 'leaf-outline',
  'harvester': 'cut-outline',
  'plough': 'git-pull-request-outline',
  'drip': 'water-outline',
  'bin': 'cube-outline',
  'carpenter': 'hammer-outline',
  'electrician': 'flash-outline',
  'event': 'calendar-outline',
  'default': 'ellipse-outline'
};

const CreateListingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
 
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([]);
  const [isDataReady, setIsDataReady] = useState(false); // New state for data readiness

  const { user, isLoading: isAuthLoading, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    photos: [],
    coordinates: [78.1134, 18.0534], // Default to a central India location (longitude, latitude)
    price: '',
    unitOfMeasure: 'per_hour',
    minimumOrder: '1',
    availableFrom: new Date(),
    availableTo: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    tags: [],
    locationAddress: '',
  });

  useEffect(() => {
    const initializeData = async () => {
      if (user?.id) {
        setFormData(prev => ({ ...prev, providerId: user.id }));
        try {
          setLoading(true);
          const categories = await CatalogueService.getCategories();
          setAvailableCategories(categories);
          setIsDataReady(true); // Set data ready after categories are fetched
        } catch (error) {
          console.error('Error initializing data:', error);
          Alert.alert('Error', 'Failed to load initial data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setIsDataReady(false);
      }
    };

    initializeData();
  }, [user]); // Depend on user to re-run when user data becomes available

  console.log('CreateListingScreen: Before conditional render. isDataReady:', isDataReady);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await CatalogueService.getCategories();
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setLoading(true);
      const subCategories = await CatalogueService.getSubCategories(categoryId);
      setAvailableSubCategories(subCategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('Error', 'Failed to load subcategories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId, subCategoryId: '' })); // Reset subcategory
    await fetchSubCategories(categoryId);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    const selectedSub = availableSubCategories.find(sub => sub._id === subCategoryId);
    setFormData(prev => ({
      ...prev,
      subCategoryId,
      unitOfMeasure: selectedSub?.defaultUnitOfMeasure || 'per_hour',
      price: selectedSub?.suggestedMinPrice?.toString() || '',
    }));
  };

  const unitOptions = [
    { value: 'per_hour', label: 'Per Hour' },
    { value: 'per_day', label: 'Per Day' },
    { value: 'per_hectare', label: 'Per Hectare' },
    { value: 'per_kg', label: 'Per Kg' },
    { value: 'per_unit', label: 'Per Unit' },
    { value: 'per_piece', label: 'Per Piece' },
  ];

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = () => {
    // TODO: Implement photo picker
    Alert.alert('Photo Picker', 'Photo picker will be implemented');
    // For now, add a placeholder photo
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, `https://picsum.photos/200/300?random=${Math.random()}`],
    }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim() || !formData.description.trim() || !formData.locationAddress.trim()) {
          Alert.alert('Validation Error', 'Please fill in Title, Description, and Location.');
          return false;
        }
        return true;
      case 2: // Category Selection
        if (!formData.categoryId || !formData.subCategoryId) {
          Alert.alert('Validation Error', 'Please select both a Category and a Subcategory.');
          return false;
        }
        return true;
      case 3: // Pricing & Availability
        if (!formData.price || parseFloat(formData.price) <= 0 || !formData.unitOfMeasure || !formData.minimumOrder || parseInt(formData.minimumOrder) <= 0) {
          Alert.alert('Validation Error', 'Please enter a valid Price, Unit, and Minimum Order.');
          return false;
        }
        if (formData.availableFrom > formData.availableTo) {
          Alert.alert('Validation Error', 'Available From date cannot be after Available To date.');
          return false;
        }
        return true;
      case 4: // Photos & Tags
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString(); // ISO 8601 format
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Could not find user information. Please try logging in again.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        providerId: user.id,
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId,
        photos: formData.photos,
        coordinates: formData.coordinates,
        price: parseFloat(formData.price),
        unitOfMeasure: formData.unitOfMeasure,
        minimumOrder: parseInt(formData.minimumOrder),
        availableFrom: formatDateForAPI(formData.availableFrom),
        availableTo: formatDateForAPI(formData.availableTo),
        tags: formData.tags,
        isActive: true,
        viewCount: 0,
        bookingCount: 0,
        isVerified: false,
        // termsAndConditions: formData.termsAndConditions, // Optional
        // videoUrl: formData.videoUrl, // Optional
      };

      const response = await ListingService.createListing(payload, token);
      
      Alert.alert('Success', 'Listing created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your service</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Title *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., John Deere Tractor with Plough"
          placeholderTextColor="#9CA3AF"
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Describe your service in detail..."
          placeholderTextColor="#9CA3AF"
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location Address *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter service location address"
          placeholderTextColor="#9CA3AF"
          value={formData.locationAddress}
          onChangeText={(text) => handleInputChange('locationAddress', text)}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Category Selection</Text>
      <Text style={styles.stepSubtitle}>Choose the right category for your service</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Category *</Text>
        {loading && <Text style={styles.loadingText}>Loading categories...</Text>}
        <View style={styles.categoryGrid}>
          {availableCategories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryCard,
                formData.categoryId === category._id && styles.categoryCardActive,
              ]}
              onPress={() => handleCategorySelect(category._id)}
            >
              <Ionicons
                name={iconMapping[category.icon] || iconMapping.default}
                size={28}
                color={
                  formData.categoryId === category._id
                    ? COLORS.PRIMARY.MAIN
                    : '#6B7280'
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  formData.categoryId === category._id && styles.categoryTextActive,
                ]}
                numberOfLines={2}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {formData.categoryId && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Subcategory *</Text>
          {loading && <Text style={styles.loadingText}>Loading subcategories...</Text>}
          {availableSubCategories.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableSubCategories.map((sub) => (
                <TouchableOpacity
                  key={sub._id}
                  style={[
                    styles.subCategoryChip,
                    formData.subCategoryId === sub._id && styles.subCategoryChipActive,
                  ]}
                  onPress={() => handleSubCategorySelect(sub._id)}
                >
                  <Text
                    style={[
                      styles.subCategoryText,
                      formData.subCategoryId === sub._id && styles.subCategoryTextActive,
                    ]}
                  >
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No subcategories available for this category</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Pricing & Availability</Text>
      <Text style={styles.stepSubtitle}>Set your pricing and availability</Text>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Price *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.inputLabel}>Unit *</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowUnitDropdown(!showUnitDropdown)}
          >
            <Text style={styles.dropdownText}>
              {unitOptions.find(u => u.value === formData.unitOfMeasure)?.label || 'Select Unit'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {showUnitDropdown && (
        <View style={styles.dropdownOptions}>
          {unitOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownOption}
              onPress={() => {
                handleInputChange('unitOfMeasure', option.value);
                setShowUnitDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Minimum Order *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="1"
          placeholderTextColor="#9CA3AF"
          value={formData.minimumOrder}
          onChangeText={(text) => handleInputChange('minimumOrder', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Available From *</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowFromDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          <Text style={styles.dateText}>
            {formData.availableFrom.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {showFromDatePicker && (
        <DateTimePicker
          value={formData.availableFrom}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowFromDatePicker(Platform.OS === 'ios');
            if (date) handleInputChange('availableFrom', date);
          }}
        />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Available To *</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowToDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          <Text style={styles.dateText}>
            {formData.availableTo.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {showToDatePicker && (
        <DateTimePicker
          value={formData.availableTo}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowToDatePicker(Platform.OS === 'ios');
            if (date) handleInputChange('availableTo', date);
          }}
        />
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Photos & Tags</Text>
      <Text style={styles.stepSubtitle}>Add photos and tags to attract more customers</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Photos *</Text>
        <TouchableOpacity style={styles.photoUploadBox} onPress={handleAddPhoto}>
          <Ionicons name="camera-outline" size={32} color="#6B7280" />
          <Text style={styles.photoUploadText}>Add Photos</Text>
        </TouchableOpacity>
        {formData.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
            {formData.photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                <TouchableOpacity
                  style={styles.photoRemove}
                  onPress={() => {
                    setFormData(prev => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tags</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            placeholder="Add tags (e.g., tractor, plough)"
            placeholderTextColor="#9CA3AF"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => {
              if (tagInput.trim()) {
                handleAddTag(tagInput.trim());
                setTagInput('');
              }
            }}
            returnKeyType="done"
          />
        </View>
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                <Ionicons name="close-circle" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  

  if (!isDataReady) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
          <Text>Loading data...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Listing</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.primaryButton, currentStep === 1 && { flex: 1 }]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep === 4 ? 'Create Listing' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.PRIMARY.MAIN,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: COLORS.PRIMARY.DARK,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
    fontWeight: '400',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  categoryCardActive: {
    borderColor: COLORS.PRIMARY.MAIN,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: COLORS.PRIMARY.MAIN,
  },
  subCategoryChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  subCategoryChipActive: {
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderColor: COLORS.PRIMARY.MAIN,
  },
  subCategoryText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#6B7280',
  },
  subCategoryTextActive: {
    color: '#fff',
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: -15,
    marginBottom: 20,
    marginHorizontal: 106,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
  },
  dateInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.PRIMARY,
    marginLeft: 12,
  },
  photoUploadBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  photoUploadText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: '#6B7280',
    marginTop: 8,
  },
  photoList: {
    marginTop: 12,
  },
  photoItem: {
    position: 'relative',
    marginRight: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagInputContainer: {
    marginBottom: 12,
  },
  tagInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.POPPINS.REGULAR,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.PRIMARY.MAIN,
    marginRight: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY.MAIN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: '#fff',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: '#6B7280',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS.REGULAR,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CreateListingScreen;
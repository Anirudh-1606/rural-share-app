
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, FONT_SIZES } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import CatalogueService from '../services/CatalogueService';
import { setCategory, setSubCategory } from '../store/slices/listingSlice';

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
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // Add icon field to SubCategory
}

import categoryIcons from '../utils/icons';

const { width } = Dimensions.get('window');


const CategoryBrowserScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const { selectedCategoryId } = route.params || {};

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await CatalogueService.getCategories();
        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0) {
          if (selectedCategoryId) {
            const categoryToSelect = fetchedCategories.find(cat => cat._id === selectedCategoryId);
            setSelectedCategory(categoryToSelect || fetchedCategories[0]);
          } else {
            setSelectedCategory(fetchedCategories[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory._id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await CatalogueService.getCategories();
      setCategories(fetchedCategories);
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
      const fetchedSubCategories = await CatalogueService.getSubCategories(categoryId);
      setSubCategories(fetchedSubCategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('Error', 'Failed to load subcategories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryPress = (subCategory: SubCategory) => {
    if (selectedCategory) {
      dispatch(setCategory(selectedCategory._id));
      dispatch(setSubCategory(subCategory._id));
      navigation.navigate('Listings'); // Navigate to the Listings screen
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Categories</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        {/* Left Pane: Categories */}
        <View style={styles.leftPane}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <Text style={styles.loadingText}>Loading categories...</Text>
            ) : (
              categories.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  style={[
                    styles.categoryItem,
                    selectedCategory?._id === category._id && styles.categoryItemActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Image
                    source={categoryIcons[category.icon] || null} // Use category.icon to get the image source
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory?._id === category._id && styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Right Pane: Subcategories */}
        <View style={styles.rightPane}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : subCategories.length > 0 ? (
            <FlatList
              data={subCategories}
              keyExtractor={(item) => item._id}
              numColumns={2}
              contentContainerStyle={styles.subCategoryGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.subCategoryTile}
                  onPress={() => handleSubCategoryPress(item)}
                >
                  <View style={styles.subCategoryIconContainer}>
                    <Image
                      source={categoryIcons[item.icon] || null}
                      style={styles.subCategoryIcon}
                    />
                  </View>
                  <Text style={styles.subCategoryText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No subcategories found.</Text>
          )}
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.PRIMARY,
    backgroundColor: COLORS.NEUTRAL.WHITE,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.LG,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  leftPane: {
    width: width * 0.28,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER.PRIMARY,
    paddingVertical: SPACING.SM,
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    marginHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
  },
  categoryItemActive: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    marginBottom: SPACING.XS,
  },
  categoryText: {
    fontSize: FONT_SIZES.XS,
    fontFamily: FONTS.POPPINS.MEDIUM,
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  categoryTextActive: {
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.PRIMARY.DARK,
  },
  rightPane: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  subCategoryGrid: {
    padding: SPACING.MD,
  },
  subCategoryTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL.WHITE,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.MD,
    margin: SPACING.SM,
    ...SHADOWS.MD,
  },
  subCategoryIconContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY.LIGHT,
    borderRadius: BORDER_RADIUS.FULL,
    marginBottom: SPACING.MD,
  },
  subCategoryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  subCategoryText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: FONTS.POPPINS.SEMIBOLD,
    color: COLORS.TEXT.PRIMARY,
    textAlign: 'center',
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
  noDataText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: FONTS.POPPINS.REGULAR,
    color: COLORS.TEXT.SECONDARY,
  },
});

export default CategoryBrowserScreen;

import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { addSkillToProfile } from '@/constants/mockProfileData';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const SKILL_CATEGORIES: Record<string, string[]> = {
  'Programming Languages': [
    'TypeScript',
    'Python',
    'JavaScript',
    'Go',
    'Rust',
    'C++',
    'Kotlin',
    'Swift',
  ],
  'Frameworks & Tools': [
    'React Native',
    'Next.js',
    'Expo',
    'Node.js',
    'Docker',
    'Git',
    'GraphQL',
    'TailwindCSS',
  ],
  'Data Science & AI': [
    'XGBoost',
    'PyTorch',
    'Scikit-learn',
    'TensorFlow',
    'Pandas',
    'LLMs & AI Engineering',
  ],
  'Cloud & DevOps': [
    'AWS',
    'Google Cloud',
    'Kubernetes',
    'Terraform',
    'CI/CD Pipelines',
  ],
  'Design & UX': [
    'Figma',
    'UI/UX Design',
    'Design Systems',
    'Prototyping',
  ],
  'Soft Skills & Management': [
    'Agile / Scrum',
    'Technical Leadership',
    'Project Management',
    'Mentorship',
  ],
};

export default function AddSkillScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const categoryKeys = Object.keys(SKILL_CATEGORIES);

  // Input 1: Filter by skills type / category
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryKeys[0]);

  // Input 2: Select skill (from selected category) or custom skill
  const [selectedSkill, setSelectedSkill] = useState<string>(SKILL_CATEGORIES[categoryKeys[0]][0]);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Input 3: Rating (1-5 stars)
  const [rating, setRating] = useState<number>(3);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsCustomMode(false);
    setCustomSkill('');
    const defaultSkill = SKILL_CATEGORIES[category]?.[0] || '';
    setSelectedSkill(defaultSkill);
  };

  const handleSave = () => {
    const finalSkillName = isCustomMode ? customSkill.trim() : selectedSkill.trim();
    if (!finalSkillName) {
      alert('Please select or type a skill name');
      return;
    }

    addSkillToProfile({
      name: finalSkillName,
      category: selectedCategory,
      rating,
    });

    router.back();
  };

  const availableSkills = SKILL_CATEGORIES[selectedCategory] || [];

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <ScreenHeader title="Add Skill & Expertise" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ThemedText style={styles.cardHeaderTitle}>New Skill Details</ThemedText>
          <ThemedText style={styles.cardHeaderSubtitle}>
            Select a skill type category and pick or enter a skill to add to your profile.
          </ThemedText>

          <View style={styles.divider} />

          {/* INPUT 1: Filter by Skills Type (Category) */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.fieldLabel}>1. SKILL TYPE CATEGORY</ThemedText>
            <View style={styles.pillsContainer}>
              {categoryKeys.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                    onPress={() => handleCategoryChange(cat)}
                  >
                    <ThemedText
                      style={[styles.categoryPillText, isSelected && styles.categoryPillTextSelected]}
                    >
                      {cat}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* INPUT 2: Select Skill (Attached to Category) */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.fieldLabel}>
              2. SELECT SKILL ({selectedCategory.toUpperCase()})
            </ThemedText>
            <View style={styles.skillsGrid}>
              {availableSkills.map((skill) => {
                const isSelected = !isCustomMode && selectedSkill === skill;
                return (
                  <Pressable
                    key={skill}
                    style={[styles.skillPill, isSelected && styles.skillPillSelected]}
                    onPress={() => {
                      setIsCustomMode(false);
                      setSelectedSkill(skill);
                    }}
                  >
                    <SymbolView
                      name={isSelected ? 'checkmark.circle.fill' : 'circle'}
                      size={14}
                      tintColor={isSelected ? '#1EBD60' : '#8E8E93'}
                    />
                    <ThemedText style={[styles.skillPillText, isSelected && styles.skillPillTextSelected]}>
                      {skill}
                    </ThemedText>
                  </Pressable>
                );
              })}
              <Pressable
                style={[styles.skillPill, isCustomMode && styles.skillPillSelected]}
                onPress={() => {
                  setIsCustomMode(true);
                }}
              >
                <SymbolView
                  name={isCustomMode ? 'checkmark.circle.fill' : 'plus.circle'}
                  size={14}
                  tintColor={isCustomMode ? '#1EBD60' : '#8E8E93'}
                />
                <ThemedText style={[styles.skillPillText, isCustomMode && styles.skillPillTextSelected]}>
                  + Other / Custom
                </ThemedText>
              </Pressable>
            </View>

            {isCustomMode && (
              <View style={styles.customInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter custom skill name..."
                  placeholderTextColor="#8E8E93"
                  value={customSkill}
                  onChangeText={setCustomSkill}
                  autoFocus
                />
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* INPUT 3: Expertise Level (1-5 Stars) */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.fieldLabel}>3. EXPERTISE LEVEL (1 - 5 STARS)</ThemedText>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isFilled = starNum <= rating;
                return (
                  <Pressable
                    key={starNum}
                    style={styles.starButton}
                    onPress={() => setRating(starNum)}
                  >
                    <SymbolView
                      name={isFilled ? 'star.fill' : 'star'}
                      size={28}
                      tintColor={isFilled ? '#1EBD60' : '#C7C7CC'}
                    />
                  </Pressable>
                );
              })}
            </View>
            <ThemedText style={styles.ratingHint}>
              {rating === 1 && '⭐ Basic Knowledge'}
              {rating === 2 && '⭐⭐ Intermediate / Working Proficiency'}
              {rating === 3 && '⭐⭐⭐ Proficient'}
              {rating === 4 && '⭐⭐⭐⭐ Advanced Specialist'}
              {rating === 5 && '⭐⭐⭐⭐⭐ Expert / Master'}
            </ThemedText>
          </View>

          {/* Save Button */}
          <Pressable style={styles.btnSave} onPress={handleSave}>
            <SymbolView name="checkmark" size={18} tintColor="#ffffff" />
            <ThemedText style={styles.btnSaveText}>Save Skill</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingTop: Spacing.four,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: Spacing.three,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  cardHeaderSubtitle: {
    fontSize: 13,
    color: '#60646C',
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginVertical: Spacing.two,
  },
  formGroup: {
    gap: Spacing.two,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#1EBD60',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B4D52',
  },
  categoryPillTextSelected: {
    color: '#1EBD60',
    fontWeight: '700',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E1E6',
  },
  skillPillSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#1EBD60',
  },
  skillPillText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  skillPillTextSelected: {
    color: '#1EBD60',
    fontWeight: '700',
  },
  customInputWrapper: {
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#1EBD60',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  starButton: {
    padding: 4,
  },
  ratingHint: {
    fontSize: 13,
    color: '#1EBD60',
    fontWeight: '600',
  },
  btnSave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1EBD60',
    paddingVertical: 14,
    borderRadius: 8,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  btnSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

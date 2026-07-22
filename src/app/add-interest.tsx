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
import {
  getProfileData,
  updateInterestsInProfile,
} from '@/constants/mockProfileData';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const PRESET_INTERESTS = [
  'Cooking',
  'Dance',
  'Art',
  'Music',
  'Photography',
  'Gaming',
  'Sports',
  'Traveling',
  'Reading',
  'Fitness',
  'Technology',
  'Cinema & Movies',
  'Volunteering',
  'Gardening',
  'Writing',
  'Cycling',
  'Hiking',
  'Design',
];

export default function AddInterestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentProfile = getProfileData();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentProfile.interests || []
  );
  const [customInterest, setCustomInterest] = useState<string>('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests([...selectedInterests, trimmed]);
    }
    setCustomInterest('');
  };

  const handleSave = () => {
    updateInterestsInProfile(selectedInterests);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <ScreenHeader title="Add Interests" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ThemedText style={styles.cardHeaderTitle}>Select Your Interests</ThemedText>
          <ThemedText style={styles.cardHeaderSubtitle}>
            Choose from the list below or add your own custom interests to personalize your profile.
          </ThemedText>

          <View style={styles.divider} />

          {/* Add Custom Interest Input */}
          <View style={styles.customAddRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Add another interest (e.g. Astronomy)..."
              placeholderTextColor="#8E8E93"
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={handleAddCustomInterest}
            />
            <Pressable style={styles.btnAddCustom} onPress={handleAddCustomInterest}>
              <SymbolView name="plus" size={16} tintColor="#ffffff" />
            </Pressable>
          </View>

          {/* Multi-select Interests List */}
          <View style={styles.interestsGrid}>
            {/* Show custom added interests first if not in preset */}
            {selectedInterests
              .filter((item) => !PRESET_INTERESTS.includes(item))
              .map((interest) => (
                <Pressable
                  key={interest}
                  style={[styles.interestChip, styles.interestChipSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <SymbolView name="checkmark.circle.fill" size={14} tintColor="#1EBD60" />
                  <ThemedText style={[styles.interestText, styles.interestTextSelected]}>
                    {interest}
                  </ThemedText>
                </Pressable>
              ))}

            {/* Show preset interests */}
            {PRESET_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Pressable
                  key={interest}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <SymbolView
                    name={isSelected ? 'checkmark.circle.fill' : 'circle'}
                    size={14}
                    tintColor={isSelected ? '#1EBD60' : '#8E8E93'}
                  />
                  <ThemedText style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                    {interest}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Selected Summary */}
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryText}>
              {selectedInterests.length} interest{selectedInterests.length === 1 ? '' : 's'} selected
            </ThemedText>
          </View>

          {/* Save Button */}
          <Pressable style={styles.btnSave} onPress={handleSave}>
            <SymbolView name="checkmark" size={18} tintColor="#ffffff" />
            <ThemedText style={styles.btnSaveText}>Save Interests</ThemedText>
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
  customAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  btnAddCustom: {
    backgroundColor: '#1EBD60',
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E1E6',
  },
  interestChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#1EBD60',
  },
  interestText: {
    fontSize: 13,
    color: '#4B4D52',
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#1EBD60',
    fontWeight: '700',
  },
  summaryRow: {
    alignItems: 'flex-end',
  },
  summaryText: {
    fontSize: 12,
    color: '#8E8E93',
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
    marginTop: Spacing.one,
  },
  btnSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

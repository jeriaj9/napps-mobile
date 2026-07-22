import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { getProfileData, ProfileData, subscribeProfileChanges } from '@/constants/mockProfileData';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>(getProfileData());

  useFocusEffect(
    useCallback(() => {
      setProfileData({ ...getProfileData() });
      const unsubscribe = subscribeProfileChanges(() => {
        setProfileData({ ...getProfileData() });
      });
      return () => unsubscribe();
    }, [])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six + 80 }]}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarBox}>
              <ThemedText style={styles.avatarText}>{profileData.initials}</ThemedText>
            </View>
            <View style={styles.headerInfo}>
              <ThemedText style={styles.nameText}>{profileData.name}</ThemedText>
              <ThemedText style={styles.roleText}>{profileData.role} - {profileData.workInformation.client}</ThemedText>
              <ThemedText style={styles.deptText}>{profileData.departmentInfo}</ThemedText>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Contact Details List */}
          <View>
            {/* Email */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconWrapper}>
                <SymbolView name="envelope" size={18} tintColor="#1EBD60" />
              </View>
              <View style={styles.contactTextWrapper}>
                <ThemedText style={styles.contactValue}>{profileData.contact.email}</ThemedText>
              </View>
            </View>
            {/* Phone */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconWrapper}>
                <SymbolView name="phone" size={18} tintColor="#1EBD60" />
              </View>
              <View style={styles.contactTextWrapper}>
                <ThemedText style={styles.contactValue}>{profileData.contact.phone}</ThemedText>
              </View>
            </View>
            {/* Location */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconWrapper}>
                <SymbolView name="mappin.and.ellipse" size={18} tintColor="#1EBD60" />
              </View>
              <View style={styles.contactTextWrapper}>
                <ThemedText style={styles.contactValue}>{profileData.contact.location}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Vacation Days */}
          <View style={styles.statsCard}>
            <ThemedText style={styles.statsLabel}>VACATION DAYS</ThemedText>
            <ThemedText style={styles.statsValue}>{profileData.stats.vacationDays}</ThemedText>
            <ThemedText style={styles.statsSublabel}>{profileData.stats.vacationDaysLabel}</ThemedText>
          </View>

          {/* Last Quarter Score */}
          <View style={styles.statsCard}>
            <ThemedText style={styles.statsLabel}>LAST QUARTER</ThemedText>
            <ThemedText style={styles.statsValue}>{profileData.stats.lastQuarterScore}%</ThemedText>
            <ThemedText style={styles.statsSublabel}>{profileData.stats.lastQuarterLabel}</ThemedText>
          </View>
        </View>

        {/* Work Information Card */}
        <View style={styles.profileCard}>
          <ThemedText style={styles.cardTitle}>Work Information</ThemedText>
          <View style={styles.workGrid}>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>START DATE</ThemedText>
              <ThemedText style={styles.gridValue}>{profileData.workInformation.startDate}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>SUPERVISOR</ThemedText>
              <ThemedText style={styles.gridValue}>{profileData.workInformation.supervisor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>VENDOR</ThemedText>
              <ThemedText style={styles.gridValue}>{profileData.workInformation.vendor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>BRANCH</ThemedText>
              <ThemedText style={styles.gridValue}>{profileData.workInformation.branch}</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.cardSubtitle}>Roles</ThemedText>
          <View style={styles.rolesRow}>
            {profileData.workInformation.roles.map((role, idx) => (
              <View key={idx} style={styles.roleBadge}>
                <ThemedText style={styles.roleBadgeText}>{role}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Interests Card */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeaderRow}>
            <ThemedText style={styles.cardTitle}>Interests</ThemedText>
            <Pressable style={styles.btnAdd} onPress={() => router.push('/add-interest')}>
              <SymbolView name="plus" size={12} tintColor="#ffffff" />
            </Pressable>
          </View>
          {profileData.interests && profileData.interests.length > 0 ? (
            <View style={styles.interestsRow}>
              {profileData.interests.map((interest, idx) => (
                <View key={idx} style={styles.interestChip}>
                  <ThemedText style={styles.interestChipText}>{interest}</ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.interestsText}>No interests added yet.</ThemedText>
          )}
        </View>

        {/* Skills & Expertise Card */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeaderRow}>
            <ThemedText style={styles.cardTitle}>Skills & Expertise</ThemedText>
            <Pressable style={styles.btnAdd} onPress={() => router.push('/add-skill')}>
              <SymbolView name="plus" size={12} tintColor="#ffffff" />
            </Pressable>
          </View>
          <View style={styles.skillsRow}>
            {profileData.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SymbolView
                      key={star}
                      name={star <= skill.rating ? 'star.fill' : 'star'}
                      size={10}
                      tintColor={star <= skill.rating ? '#1EBD60' : '#C7C7CC'}
                    />
                  ))}
                </View>
                <ThemedText style={styles.skillText}>{skill.name}</ThemedText>
              </View>
            ))}
          </View>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1EBD60',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  roleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1EBD60',
  },
  deptText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginVertical: Spacing.four,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    gap: Spacing.three,
  },
  contactIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrapper: {
    flex: 1,
    gap: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 4,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 32,
    paddingTop: 12,
    paddingBottom: 6,
    fontWeight: '600',
    color: '#1EBD60',
  },
  statsSublabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  btnAdd: {
    backgroundColor: '#1EBD60',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#60646C',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  workGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.four,
    marginBottom: Spacing.two,
  },
  workGridItem: {
    width: '45%',
    gap: 2,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  roleBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1EBD60',
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: 4,
  },
  interestChip: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B4D52',
  },
  interestsText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: 4,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    gap: Spacing.two,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});


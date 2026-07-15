import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const mockProfileData = {
  initials: 'SL',
  name: 'SAMUEL LUIS',
  role: 'Engineer II',
  departmentInfo: 'Engineering • Joined October 2020',
  contact: {
    email: 'samuelluis@outlook.com',
    phone: '829-570-4634',
    location: 'Santo Domingo R.D.',
  },
  stats: {
    vacationDays: 12,
    vacationDaysLabel: 'Remaining',
    lastQuarterScore: 0,
    lastQuarterLabel: 'Q1 2026',
  },
  workInformation: {
    startDate: 'October 12, 2020',
    supervisor: 'JUAN PRADO',
    vendor: 'Not provided',
    branch: 'NTG',
    client: 'Verizon',
    roles: ['ADMIN', 'SUPERVISOR'],
  },
  interests: 'No interests added yet.',
  skills: [
    { name: 'XGBoost', rating: 3 },
    { name: 'Scikit-learn', rating: 2 },
    { name: 'PyTorch', rating: 1 },
  ],
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

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
              <ThemedText style={styles.avatarText}>{mockProfileData.initials}</ThemedText>
            </View>
            <View style={styles.headerInfo}>
              <ThemedText style={styles.nameText}>{mockProfileData.name}</ThemedText>
              <ThemedText style={styles.roleText}>{mockProfileData.role} - {mockProfileData.workInformation.client}</ThemedText>
              <ThemedText style={styles.deptText}>{mockProfileData.departmentInfo}</ThemedText>
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
                <ThemedText style={styles.contactValue}>{mockProfileData.contact.email}</ThemedText>
              </View>
            </View>
            {/* Phone */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconWrapper}>
                <SymbolView name="phone" size={18} tintColor="#1EBD60" />
              </View>
              <View style={styles.contactTextWrapper}>
                <ThemedText style={styles.contactValue}>{mockProfileData.contact.phone}</ThemedText>
              </View>
            </View>
            {/* Location */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconWrapper}>
                <SymbolView name="mappin.and.ellipse" size={18} tintColor="#1EBD60" />
              </View>
              <View style={styles.contactTextWrapper}>
                <ThemedText style={styles.contactValue}>{mockProfileData.contact.location}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Vacation Days */}
          <View style={styles.statsCard}>
            <ThemedText style={styles.statsLabel}>VACATION DAYS</ThemedText>
            <ThemedText style={styles.statsValue}>{mockProfileData.stats.vacationDays}</ThemedText>
            <ThemedText style={styles.statsSublabel}>{mockProfileData.stats.vacationDaysLabel}</ThemedText>
          </View>

          {/* Last Quarter Score */}
          <View style={styles.statsCard}>
            <ThemedText style={styles.statsLabel}>LAST QUARTER</ThemedText>
            <ThemedText style={styles.statsValue}>{mockProfileData.stats.lastQuarterScore}%</ThemedText>
            <ThemedText style={styles.statsSublabel}>{mockProfileData.stats.lastQuarterLabel}</ThemedText>
          </View>
        </View>

        {/* Work Information Card */}
        <View style={styles.profileCard}>
          <ThemedText style={styles.cardTitle}>Work Information</ThemedText>
          <View style={styles.workGrid}>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>START DATE</ThemedText>
              <ThemedText style={styles.gridValue}>{mockProfileData.workInformation.startDate}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>SUPERVISOR</ThemedText>
              <ThemedText style={styles.gridValue}>{mockProfileData.workInformation.supervisor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>VENDOR</ThemedText>
              <ThemedText style={styles.gridValue}>{mockProfileData.workInformation.vendor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <ThemedText style={styles.gridLabel}>BRANCH</ThemedText>
              <ThemedText style={styles.gridValue}>{mockProfileData.workInformation.branch}</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.cardSubtitle}>Roles</ThemedText>
          <View style={styles.rolesRow}>
            {mockProfileData.workInformation.roles.map((role, idx) => (
              <View key={idx} style={styles.roleBadge}>
                <ThemedText style={styles.roleBadgeText}>{role}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Interests Card */}
        <View style={styles.profileCard}>
          <ThemedText style={styles.cardTitle}>Interests</ThemedText>
          <ThemedText style={styles.interestsText}>{mockProfileData.interests}</ThemedText>
        </View>

        {/* Skills & Expertise Card */}
        <View style={styles.profileCard}>
          <ThemedText style={styles.cardTitle}>Skills & Expertise</ThemedText>
          <View style={styles.skillsRow}>
            {mockProfileData.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <View style={styles.starsRow}>
                  {[1, 2, 3].map((star) => (
                    <SymbolView
                      key={star}
                      name={star <= skill.rating ? 'star.fill' : 'star'}
                      size={10}
                      tintColor={star <= skill.rating ? '#1EBD60' : '#8E8E93'}
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: Spacing.two,
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
  positionItem: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  positionAccent: {
    width: 3,
    backgroundColor: '#1EBD60',
    borderRadius: 2,
  },
  positionContent: {
    flex: 1,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  positionClient: {
    fontSize: 12,
    color: '#8E8E93',
  },
  positionDetails: {
    fontSize: 12,
    color: '#8E8E93',
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
  interestsText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
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

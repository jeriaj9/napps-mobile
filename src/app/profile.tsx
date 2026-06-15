import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileCard } from '@/components/profile/profile-card';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const mockProfileData = {
  header: {
    initials: 'SL',
    name: 'SAMUEL LUIS',
    badges: ['ACTIVE', 'ADMIN'],
    jobTitle: 'Engineer II',
    id: '2037',
  },
  evaluationScore: {
    label: 'NO CHANGE',
    thisQuarter: 0,
    thisQuarterLabel: 'Q2 2026',
    lastQuarter: 0,
    lastQuarterLabel: 'Q1 2026',
  },
  contact: {
    phone: '8295704634',
    email: 'samuelluis@outlook.com',
    vendor: 'Not provided',
  },
  address: 'No address added yet.',
  workInformation: {
    startDate: 'October 12, 2020',
    supervisor: 'JUAN PRADO',
    vendor: 'Not provided',
    branch: 'NTG',
    positions: [
      {
        title: 'Engineer II',
        client: 'Verizon',
        details: 'Newtech 02 | YUNHONG LIN',
      },
    ],
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
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.backgroundElement }]}
      contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={[styles.headerGradient, { paddingTop: insets.top + Spacing.four }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{mockProfileData.header.initials}</ThemedText>
            {/* Active dot */}
            <View style={styles.activeDot} />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <ThemedText type="subtitle" style={styles.nameText}>
                {mockProfileData.header.name}
              </ThemedText>
            </View>
            <View style={styles.badgeRow}>
              {mockProfileData.header.badges.map((badge, idx) => (
                <View key={idx} style={[styles.badge, badge === 'ADMIN' && styles.badgeAdmin]}>
                  <ThemedText style={[styles.badgeText, badge === 'ADMIN' && styles.badgeTextAdmin]}>
                    {badge}
                  </ThemedText>
                </View>
              ))}
            </View>
            <ThemedText style={styles.headerSubtext}>{mockProfileData.header.jobTitle}</ThemedText>
            <ThemedText style={styles.headerSubtext}>ID: {mockProfileData.header.id}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {/* Evaluation Score */}
        <ProfileCard
          title="Evaluation Score"
          headerRight={
            <View style={styles.noChangeBadge}>
              <ThemedText style={styles.noChangeText}>{mockProfileData.evaluationScore.label}</ThemedText>
            </View>
          }>
          <View style={styles.evalRow}>
            <View style={styles.evalColumn}>
              <ThemedText type="small" themeColor="textSecondary">
                This Quarter
              </ThemedText>
              <View style={styles.evalCircle}>
                <ThemedText type="smallBold">{mockProfileData.evaluationScore.thisQuarter}%</ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {mockProfileData.evaluationScore.thisQuarterLabel}
              </ThemedText>
            </View>
            <View style={styles.evalColumn}>
              <ThemedText type="small" themeColor="textSecondary">
                Last Quarter
              </ThemedText>
              <View style={styles.evalCircle}>
                <ThemedText type="smallBold">{mockProfileData.evaluationScore.lastQuarter}%</ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {mockProfileData.evaluationScore.lastQuarterLabel}
              </ThemedText>
            </View>
          </View>
        </ProfileCard>

        {/* Contact Information */}
        <ProfileCard
          title="Contact Information"
          headerRight={<SymbolView name="pencil" size={16} tintColor={theme.textSecondary} />}>
          <View style={styles.infoRow}>
            <SymbolView name="phone" size={16} tintColor={theme.textSecondary} />
            <ThemedText style={styles.infoText}>{mockProfileData.contact.phone}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <SymbolView name="envelope" size={16} tintColor={theme.textSecondary} />
            <ThemedText style={styles.infoText}>{mockProfileData.contact.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <SymbolView name="briefcase" size={16} tintColor={theme.textSecondary} />
            <ThemedText style={styles.infoText}>{mockProfileData.contact.vendor}</ThemedText>
          </View>
        </ProfileCard>

        {/* Address */}
        <ProfileCard
          title="Address"
          headerRight={<SymbolView name="pencil" size={16} tintColor={theme.textSecondary} />}>
          <View style={styles.infoRow}>
            <SymbolView name="mappin.and.ellipse" size={16} tintColor={theme.textSecondary} />
            <ThemedText style={styles.infoText} themeColor="textSecondary">
              {mockProfileData.address}
            </ThemedText>
          </View>
        </ProfileCard>

        {/* Work Information */}
        <ProfileCard title="Work Information">
          <View style={styles.workGrid}>
            <View style={styles.workGridItem}>
              <View style={styles.infoRowSmall}>
                <SymbolView name="calendar" size={14} tintColor={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  Start Date
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{mockProfileData.workInformation.startDate}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <View style={styles.infoRowSmall}>
                <SymbolView name="person" size={14} tintColor={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  Supervisor
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{mockProfileData.workInformation.supervisor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <View style={styles.infoRowSmall}>
                <SymbolView name="building.2" size={14} tintColor={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  Vendor
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{mockProfileData.workInformation.vendor}</ThemedText>
            </View>
            <View style={styles.workGridItem}>
              <View style={styles.infoRowSmall}>
                <SymbolView name="star" size={14} tintColor={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  Branch
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{mockProfileData.workInformation.branch}</ThemedText>
            </View>
          </View>

          <ThemedText type="smallBold" style={styles.sectionSubTitle}>
            Positions
          </ThemedText>
          {mockProfileData.workInformation.positions.map((pos, idx) => (
            <View key={idx} style={styles.positionItem}>
              <View style={styles.positionAccent} />
              <View>
                <ThemedText style={styles.positionTitle}>{pos.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Client: {pos.client}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {pos.details}
                </ThemedText>
              </View>
            </View>
          ))}

          <ThemedText type="smallBold" style={styles.sectionSubTitle}>
            Roles
          </ThemedText>
          <View style={styles.badgeRow}>
            {mockProfileData.workInformation.roles.map((role, idx) => (
              <View key={idx} style={styles.roleBadge}>
                <ThemedText type="smallBold" style={styles.roleBadgeText}>
                  {role}
                </ThemedText>
              </View>
            ))}
          </View>
        </ProfileCard>

        {/* Interests */}
        <ProfileCard
          title="Interests"
          headerRight={<SymbolView name="pencil" size={16} tintColor={theme.textSecondary} />}>
          <ThemedText themeColor="textSecondary">{mockProfileData.interests}</ThemedText>
        </ProfileCard>

        {/* Skills & Expertise */}
        <ProfileCard
          title="Skills & Expertise"
          headerRight={<SymbolView name="plus" size={16} tintColor={theme.textSecondary} />}>
          <View style={styles.skillsRow}>
            {mockProfileData.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <View style={styles.starsRow}>
                  {[1, 2, 3].map((star) => (
                    <SymbolView
                      key={star}
                      name={star <= skill.rating ? 'star.fill' : 'star'}
                      size={10}
                      tintColor={star <= skill.rating ? '#4CAF50' : theme.textSecondary}
                    />
                  ))}
                </View>
                <ThemedText type="smallBold" style={styles.skillText}>
                  {skill.name}
                </ThemedText>
                <SymbolView name="trash" size={12} tintColor="#E53935" />
              </View>
            ))}
          </View>
        </ProfileCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  headerGradient: {
    backgroundColor: '#1E7C9A', // Teal/Blue gradient match
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: Spacing.four,
    borderBottomRightRadius: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1E7C9A',
  },
  headerInfo: {
    flex: 1,
    gap: Spacing.one / 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
    marginBottom: Spacing.one,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeAdmin: {
    backgroundColor: '#FFB300',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeTextAdmin: {
    color: '#000000',
  },
  headerSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  cardsContainer: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  noChangeBadge: {
    backgroundColor: '#F0F0F3',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noChangeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#60646C',
  },
  evalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.two,
  },
  evalColumn: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  evalCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#E0E1E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  workGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.four,
    marginBottom: Spacing.four,
  },
  workGridItem: {
    width: '45%',
    gap: Spacing.one,
  },
  infoRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  sectionSubTitle: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  positionItem: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  positionAccent: {
    width: 3,
    backgroundColor: '#1E7C9A',
    borderRadius: 2,
  },
  positionTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 16,
  },
  roleBadgeText: {
    color: '#1565C0',
    fontSize: 12,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F3', // Light theme assumption, better to use themed view
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
  },
});

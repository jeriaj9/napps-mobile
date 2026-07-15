import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export default function AppTabs() {
  const router = useRouter();

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="feed" href="/" asChild>
            <TabButton icon="newspaper" label="FEED" />
          </TabTrigger>
          <TabTrigger name="tickets" href="/tickets" asChild>
            <TabButton icon="ticket" label="TICKETS" />
          </TabTrigger>

          {/* Floating center button */}
          <Pressable
            style={styles.floatingButton}
            onPress={() => router.push('/new-ticket')}
          >
            <SymbolView name="plus" size={22} tintColor="#ffffff" />
          </Pressable>

          <TabTrigger name="benefits" href="/benefits" asChild>
            <TabButton icon="gift" label="BENEFITS" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon="person" label="PROFILE" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface CustomTabButtonProps extends TabTriggerSlotProps {
  icon: string;
  label: string;
}

export function TabButton({ children, isFocused, icon, label, ...props }: CustomTabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
        <SymbolView
          name={isFocused ? `${icon}.fill` as any : icon as any}
          size={20}
          tintColor={isFocused ? '#1EBD60' : '#8E8E93'}
        />
      </View>
      <ThemedText style={[styles.tabLabel, { color: isFocused ? '#1EBD60' : '#8E8E93' }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="background" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E1E6',
    height: 75,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 600,
    height: '100%',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1EBD60',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1EBD60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: -24,
    zIndex: 20,
    cursor: 'pointer',
  },
});

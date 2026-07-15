import { Tabs, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tickets" />
      <Tabs.Screen name="benefits" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderTabButton = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const isFocused = state.index === routeIndex;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    let label = 'HOME';
    let iconName = 'house';
    let iconFocusedName = 'house.fill';

    if (route.name === 'index') {
      label = 'FEED';
      iconName = 'newspaper';
      iconFocusedName = 'newspaper.fill';
    } else if (route.name === 'tickets') {
      label = 'TICKETS';
      iconName = 'ticket';
      iconFocusedName = 'ticket.fill';
    } else if (route.name === 'benefits') {
      label = 'BENEFITS';
      iconName = 'gift';
      iconFocusedName = 'gift.fill';
    } else if (route.name === 'profile') {
      label = 'PROFILE';
      iconName = 'person';
      iconFocusedName = 'person.fill';
    }

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={styles.tabButton}
      >
        <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
          <SymbolView
            name={isFocused ? iconFocusedName : iconName}
            size={22}
            tintColor={isFocused ? '#1EBD60' : '#8E8E93'}
          />
        </View>
        <ThemedText
          style={[styles.tabLabel, { color: isFocused ? '#1EBD60' : '#8E8E93' }]}
        >
          {label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom || Spacing.two }]}>
      <View style={styles.tabBarContent}>
        {renderTabButton(0)}
        {renderTabButton(1)}
        
        {/* Floating Center Action Button */}
        <Pressable
          style={styles.floatingButton}
          onPress={() => router.push('/new-ticket')}
        >
          <SymbolView name="plus" size={26} tintColor="#ffffff" />
        </Pressable>

        {renderTabButton(2)}
        {renderTabButton(3)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E1E6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  floatingButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#1EBD60',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1EBD60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginTop: -28, // Pulls it upwards to overlap the tab bar top border
    zIndex: 20,
  },
});

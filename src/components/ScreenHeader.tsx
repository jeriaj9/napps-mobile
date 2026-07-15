import { SymbolView } from 'expo-symbols';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  rightContent?: ReactNode;
  children?: ReactNode; // For custom layout (like Profile)
  onBackPress?: () => void;
}


export function ScreenHeader({ title, subtitle, rightContent, children, onBackPress }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        {onBackPress ? (
          <View style={styles.leftContainer}>
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <SymbolView name="chevron.left" size={22} tintColor="#000000" />
            </Pressable>
            {title && (
              <ThemedText type="smallBold" style={styles.headerTitleBack}>
                {title}
              </ThemedText>
            )}
          </View>
        ) : (
          <View style={styles.headerTextContainer}>
            {title && (
              <ThemedText type="smallBold" style={styles.headerTitle}>
                {title}
              </ThemedText>
            )}
            {subtitle && (
              <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
            )}
          </View>
        )}
        {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      </View>
      {children && <View style={styles.headerChildren}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    zIndex: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: Spacing.two,
    padding: Spacing.one,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 24,
    paddingTop: 8,
    fontWeight: '700',
  },
  headerTitleBack: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#60646C',
    fontSize: 12,
    marginTop: 2,
  },
  rightContent: {
    justifyContent: 'center',
  },
  headerChildren: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
});

import { Image } from 'expo-image';
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
    <View style={styles.container}>
      {/* Global White App Bar */}
      <View style={[styles.globalAppBar, { paddingTop: insets.top }]}>
        <Image
          source={require('@/assets/images/evosphere-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Contextual Teal Header */}
      <View style={styles.contextualHeader}>
        {(title || subtitle || rightContent || onBackPress) && (
          <View style={styles.headerContent}>
            {onBackPress && (
              <Pressable onPress={onBackPress} style={styles.backButton}>
                <SymbolView name="chevron.left" size={20} tintColor="#ffffff" />
              </Pressable>
            )}
            <View style={styles.headerTextContainer}>
              {title && (
                <ThemedText type="subtitle" style={styles.headerTitle}>
                  {title}
                </ThemedText>
              )}
              {subtitle && (
                <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
              )}
            </View>
            {rightContent && <View>{rightContent}</View>}
          </View>
        )}
        {children && <View style={styles.headerChildren}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  globalAppBar: {
    backgroundColor: '#ffffff',
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    alignItems: 'flex-start',
  },
  logo: {
    height: 24,
    width: 140,
    marginTop: Spacing.two,
  },
  contextualHeader: {
    backgroundColor: '#1E7C9A', // Teal Gradient match
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: Spacing.four,
    borderBottomRightRadius: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    marginRight: Spacing.two,
    padding: Spacing.one,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: Spacing.four,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  headerChildren: {
    paddingTop: Spacing.four,
  },
});

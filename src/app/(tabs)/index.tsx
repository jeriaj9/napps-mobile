import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  isHR: boolean;
}

const USERS = {
  EMPLOYEE: {
    id: 'u-1',
    name: 'Samuel Luis',
    role: 'Frontend Dev',
    initials: 'S',
    isHR: false,
  },
  HR: {
    id: 'u-2',
    name: 'Ana Sanchez',
    role: 'HR Manager',
    initials: 'A',
    isHR: true,
  },
};

interface Comment {
  id: string;
  author: string;
  role: string;
  initials: string;
  content: string;
  timeAgo: string;
}

interface FeedPost {
  id: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  timeAgo: string;
  content: string;
  media: string[];
  likes: number;
  commentsCount: number;
  liked?: boolean;
  comments: Comment[];
  month: string; // e.g. "May 2026", "June 2026"
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    author: { name: 'EDWIN FABIAN', role: 'SOFTWARE ENGINEER II', initials: 'E' },
    timeAgo: '33 days ago',
    content: 'prueba gif',
    media: ['gif_media_1'],
    likes: 0,
    commentsCount: 0,
    liked: false,
    comments: [],
    month: 'May 2026',
  },
  {
    id: 'post-2',
    author: { name: 'EDWIN FABIAN', role: 'SOFTWARE ENGINEER II', initials: 'E' },
    timeAgo: '33 days ago',
    content: 'JPG TEST',
    media: ['jpg_media_1'],
    likes: 0,
    commentsCount: 0,
    liked: false,
    comments: [],
    month: 'May 2026',
  },
  {
    id: 'post-3',
    author: { name: 'ANA SANCHEZ', role: 'HR Manager', initials: 'A' },
    timeAgo: '40 days ago',
    content: "Great teams aren't just built at work—sometimes they're built over games, laughs, and a little friendly competition. 🎮💚",
    media: ['comp_media_1'],
    likes: 5,
    commentsCount: 0,
    liked: false,
    comments: [],
    month: 'May 2026',
  },
  {
    id: 'post-4',
    author: { name: 'ANA SANCHEZ', role: 'HR Manager', initials: 'A' },
    timeAgo: '40 days ago',
    content: '¡Celebramos su aniversario con todo!\n\nEn mayo, reconocemos a quienes celebran otro año más de dejar huella en nuestro equipo. ¡Gracias por su compromiso, dedicación y por aportar su talento día a día!...',
    media: ['anniv_media_1', 'anniv_media_2'],
    likes: 12,
    commentsCount: 1,
    liked: true,
    comments: [
      {
        id: 'c-1',
        author: 'Samuel Luis',
        role: 'Frontend Dev',
        initials: 'S',
        content: '¡Muchas felicidades! 🎉 Que sigan los éxitos.',
        timeAgo: '39 days ago',
      },
    ],
    month: 'May 2026',
  },
  {
    id: 'post-5',
    author: { name: 'ANA SANCHEZ', role: 'HR Manager', initials: 'A' },
    timeAgo: '40 days ago',
    content: '⭐¡Un nuevo mes para celebrar la vida!⭐\n\nA todos nuestros cumpleañeros de Mayo, les deseamos un año lleno de logros, salud, risas y grandes aventuras....',
    media: ['bday_media_1'],
    likes: 8,
    commentsCount: 0,
    liked: false,
    comments: [],
    month: 'May 2026',
  },
];

const MOCK_UPLOAD_IMAGES = [
  { name: 'team_outing.jpg', id: 'img-1' },
  { name: 'office_announcement.png', id: 'img-2' },
  { name: 'welcome_kit.jpg', id: 'img-3' },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // User role state
  const [currentUser, setCurrentUser] = useState<User>(USERS.EMPLOYEE);

  // Feed states
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [showMonthModal, setShowMonthModal] = useState(false);

  // New post form states
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedUploadImage, setSelectedUploadImage] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Formatting toolbar states
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  // Comments drawer states
  const [activeCommentPost, setActiveCommentPost] = useState<FeedPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const monthsList = ['All', 'May 2026', 'June 2026'];

  const toggleFormat = (format: string) => {
    if (activeFormats.includes(format)) {
      setActiveFormats(activeFormats.filter((f) => f !== format));
    } else {
      setActiveFormats([...activeFormats, format]);
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const newPost: FeedPost = {
        id: `post-${Date.now()}`,
        author: {
          name: currentUser.name,
          role: currentUser.role,
          initials: currentUser.initials,
        },
        timeAgo: 'Just now',
        content: newPostContent,
        media: selectedUploadImage ? [selectedUploadImage] : [],
        likes: 0,
        commentsCount: 0,
        liked: false,
        comments: [],
        month: 'June 2026',
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setSelectedUploadImage(null);
      setActiveFormats([]);
      setIsPosting(false);
    }, 1000);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !activeCommentPost) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      content: newCommentText,
      timeAgo: 'Just now',
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === activeCommentPost.id) {
        const updatedComments = [...post.comments, newComment];
        return {
          ...post,
          comments: updatedComments,
          commentsCount: updatedComments.length,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewCommentText('');

    // Update the drawer reference
    const freshlyUpdated = updatedPosts.find((p) => p.id === activeCommentPost.id);
    if (freshlyUpdated) {
      setActiveCommentPost(freshlyUpdated);
    }
  };

  // Filtered posts logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = selectedMonth === 'All' || post.month === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [posts, searchQuery, selectedMonth]);

  const renderPostItem = ({ item }: { item: FeedPost }) => {
    return (
      <View style={[styles.postCard, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.avatarContainer}>
            <ThemedText type="smallBold" style={styles.avatarText}>
              {item.author.initials}
            </ThemedText>
          </View>
          <View style={styles.postHeaderInfo}>
            <ThemedText type="smallBold" style={styles.authorName}>
              {item.author.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.authorRole}>
              {item.author.role} • {item.timeAgo}
            </ThemedText>
          </View>
          <Pressable style={styles.threeDotsButton}>
            <SymbolView name="ellipsis" size={16} tintColor={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Post Content */}
        <View style={styles.postBody}>
          <ThemedText style={[styles.postContent, { color: theme.text }]}>
            {item.content}
          </ThemedText>

          {/* Media Galleries */}
          {item.media.length > 0 && (
            <View style={styles.mediaContainer}>
              {item.media.map((imgName, idx) => (
                <View
                  key={imgName}
                  style={[
                    styles.mediaPlaceholder,
                    item.media.length === 2 && { flex: 1, height: 140 },
                    { backgroundColor: theme.backgroundElement },
                  ]}>
                  <SymbolView name="photo" size={24} tintColor={theme.textSecondary} />
                  <ThemedText type="small" themeColor="textSecondary" style={styles.mediaPlaceholderText}>
                    {imgName.startsWith('img') ? imgName : 'Post Image'}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Post Divider */}
        <View style={[styles.postDivider, { backgroundColor: theme.backgroundSelected }]} />

        {/* Post Footer */}
        <View style={styles.postFooter}>
          {/* Like */}
          <Pressable style={styles.footerAction} onPress={() => handleLikePost(item.id)}>
            <SymbolView
              name={item.liked ? 'hand.thumbsup.fill' : 'hand.thumbsup'}
              size={16}
              tintColor={item.liked ? '#1E7C9A' : theme.textSecondary}
            />
            <ThemedText
              type="smallBold"
              style={[
                styles.actionCount,
                { color: item.liked ? '#1E7C9A' : theme.textSecondary },
              ]}>
              {item.likes}
            </ThemedText>
          </Pressable>

          {/* Comments */}
          <Pressable style={styles.footerAction} onPress={() => setActiveCommentPost(item)}>
            <SymbolView name="bubble.left" size={16} tintColor={theme.textSecondary} />
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.actionCount}>
              {item.commentsCount}
            </ThemedText>
          </Pressable>

          {/* Share */}
          <Pressable style={styles.footerAction}>
            <SymbolView name="square.and.arrow.up" size={16} tintColor={theme.textSecondary} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      {/* Unified Screen Header */}
      <ScreenHeader
        title="Feed"
        subtitle="What's happening in the company"
        rightContent={
          <Pressable
            style={styles.userToggleBadge}
            onPress={() =>
              setCurrentUser((prev) =>
                prev.id === USERS.EMPLOYEE.id ? USERS.HR : USERS.EMPLOYEE
              )
            }
          >
            <View style={styles.headerUserAvatar}>
              <ThemedText type="smallBold" style={styles.headerUserAvatarText}>
                {currentUser.initials}
              </ThemedText>
            </View>
            <View style={styles.headerUserInfo}>
              <ThemedText type="smallBold" style={styles.headerUserName}>
                {currentUser.name}
              </ThemedText>
              <View style={[styles.headerUserRoleBadge, currentUser.isHR ? styles.hrBadge : styles.employeeBadge]}>
                <ThemedText type="smallBold" style={styles.headerUserRoleText}>
                  {currentUser.isHR ? 'HR' : 'Employee'}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        }
      />

      {/* Main FlatList containing creator card and list elements */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(post) => post.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        ListHeaderComponent={
          <View style={styles.headerComponentWrapper}>
            {/* Filter and Search Section */}
            <View style={styles.searchRow}>
              {/* Month selector */}
              <Pressable
                style={[
                  styles.dropdownButton,
                  { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
                ]}
                onPress={() => setShowMonthModal(true)}>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 13 }}>
                  {selectedMonth === 'All' ? 'Select month' : selectedMonth}
                </ThemedText>
                <SymbolView name="chevron.down" size={12} tintColor={theme.textSecondary} />
              </Pressable>

              {/* Search input */}
              <View
                style={[
                  styles.searchInputContainer,
                  { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
                ]}>
                <SymbolView name="magnifyingglass" size={16} tintColor={theme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search posts..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Creator Post Card */}
            {currentUser.isHR && (
              <View style={[styles.createPostCard, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
              {/* Fake Formatting Toolbar */}
              <View style={[styles.toolbar, { borderBottomColor: theme.backgroundSelected }]}>
                <Pressable
                  style={[styles.toolbarButton, activeFormats.includes('B') && styles.toolbarButtonActive]}
                  onPress={() => toggleFormat('B')}>
                  <ThemedText style={styles.toolbarTextBold}>B</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.toolbarButton, activeFormats.includes('I') && styles.toolbarButtonActive]}
                  onPress={() => toggleFormat('I')}>
                  <ThemedText style={styles.toolbarTextItalic}>I</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.toolbarButton, activeFormats.includes('U') && styles.toolbarButtonActive]}
                  onPress={() => toggleFormat('U')}>
                  <ThemedText style={styles.toolbarTextUnderline}>U</ThemedText>
                </Pressable>
                <View style={[styles.toolbarDivider, { backgroundColor: theme.backgroundSelected }]} />
                <Pressable style={styles.toolbarButton}>
                  <SymbolView name="list.bullet" size={14} tintColor={theme.textSecondary} />
                </Pressable>
                <Pressable style={styles.toolbarButton}>
                  <SymbolView name="list.number" size={14} tintColor={theme.textSecondary} />
                </Pressable>
                <View style={[styles.toolbarDivider, { backgroundColor: theme.backgroundSelected }]} />
                <Pressable style={styles.toolbarButton}>
                  <SymbolView name="link" size={14} tintColor={theme.textSecondary} />
                </Pressable>
                <Pressable style={styles.toolbarButton}>
                  <SymbolView name="text.alignleft" size={14} tintColor={theme.textSecondary} />
                </Pressable>
              </View>

              {/* Message content area */}
              <TextInput
                style={[
                  styles.createPostInput,
                  { color: theme.text },
                  activeFormats.includes('B') && { fontWeight: '700' },
                  activeFormats.includes('I') && { fontStyle: 'italic' },
                  activeFormats.includes('U') && { textDecorationLine: 'underline' },
                ]}
                placeholder="Write an update for the team..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
                value={newPostContent}
                onChangeText={setNewPostContent}
              />

              {/* Attachment preview if selected */}
              {selectedUploadImage && (
                <View style={[styles.uploadedImagePreview, { borderColor: theme.backgroundSelected }]}>
                  <SymbolView name="photo.fill" size={16} tintColor="#1E7C9A" />
                  <ThemedText type="smallBold" style={{ flex: 1, marginLeft: Spacing.two }}>
                    {selectedUploadImage}
                  </ThemedText>
                  <Pressable onPress={() => setSelectedUploadImage(null)}>
                    <SymbolView name="xmark.circle.fill" size={18} tintColor="#D32F2F" />
                  </Pressable>
                </View>
              )}

              {/* Add Media Area */}
              {!selectedUploadImage && (
                <Pressable
                  style={[styles.addMediaArea, { borderColor: theme.backgroundSelected }]}
                  onPress={() => setShowMediaModal(true)}>
                  <SymbolView name="icloud.and.arrow.up" size={24} tintColor="#1E7C9A" />
                  <ThemedText type="smallBold" style={styles.uploadMainText}>
                    Click to upload an image
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.uploadSubText}>
                    JPEG, PNG, WebP, or GIF — max 15 MB
                  </ThemedText>
                </Pressable>
              )}

              {/* Action Area */}
              <View style={styles.createPostActions}>
                <Pressable
                  style={[
                    styles.postButton,
                    (!newPostContent.trim() || isPosting) && styles.postButtonDisabled,
                  ]}
                  disabled={!newPostContent.trim() || isPosting}
                  onPress={handleCreatePost}>
                  {isPosting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <ThemedText type="smallBold" style={styles.postButtonText}>
                      Post
                    </ThemedText>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText themeColor="textSecondary">
              No posts found. Try writing a new update!
            </ThemedText>
          </View>
        }
      />

      {/* Month Filter Modal */}
      <Modal
        visible={showMonthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMonthModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <ThemedText type="smallBold" style={styles.modalTitle}>
              Filter by Month
            </ThemedText>
            {monthsList.map((month) => (
              <Pressable
                key={month}
                style={[
                  styles.modalItem,
                  { borderColor: theme.backgroundSelected },
                  selectedMonth === month && { backgroundColor: theme.backgroundElement },
                ]}
                onPress={() => {
                  setSelectedMonth(month);
                  setShowMonthModal(false);
                }}>
                <ThemedText style={{ fontWeight: selectedMonth === month ? '700' : '400' }}>
                  {month === 'All' ? 'Show All Months' : month}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Mock Media Picker Modal */}
      <Modal
        visible={showMediaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMediaModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                Select Image to Upload
              </ThemedText>
              <Pressable onPress={() => setShowMediaModal(false)}>
                <SymbolView name="xmark" size={20} tintColor={theme.text} />
              </Pressable>
            </View>
            <View style={{ gap: Spacing.two, marginTop: Spacing.two }}>
              {MOCK_UPLOAD_IMAGES.map((img) => (
                <Pressable
                  key={img.id}
                  style={[styles.modalListItem, { borderColor: theme.backgroundSelected }]}
                  onPress={() => {
                    setSelectedUploadImage(img.name);
                    setShowMediaModal(false);
                  }}>
                  <SymbolView name="photo" size={20} tintColor="#1E7C9A" />
                  <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>
                    {img.name}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Slide-up Modal Drawer */}
      <Modal
        visible={activeCommentPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveCommentPost(null)}>
        <View style={styles.drawerOverlay}>
          <Pressable style={styles.drawerDismissZone} onPress={() => setActiveCommentPost(null)} />
          <View style={[styles.drawerContent, { backgroundColor: theme.background }]}>
            {/* Drawer Header */}
            <View style={[styles.drawerHeader, { borderBottomColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                Comments ({activeCommentPost?.commentsCount})
              </ThemedText>
              <Pressable onPress={() => setActiveCommentPost(null)}>
                <SymbolView name="xmark.circle.fill" size={24} tintColor={theme.textSecondary} />
              </Pressable>
            </View>

            {/* Comments List */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {activeCommentPost && activeCommentPost.comments.length > 0 ? (
                activeCommentPost.comments.map((comment) => (
                  <View
                    key={comment.id}
                    style={[styles.commentItem, { borderBottomColor: theme.backgroundSelected }]}>
                    <View style={styles.commentAvatar}>
                      <ThemedText type="smallBold" style={styles.avatarText}>
                        {comment.initials}
                      </ThemedText>
                    </View>
                    <View style={styles.commentBody}>
                      <View style={styles.commentHeaderInfo}>
                        <ThemedText type="smallBold" style={{ fontSize: 12 }}>
                          {comment.author}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 10 }}>
                          {comment.role} • {comment.timeAgo}
                        </ThemedText>
                      </View>
                      <ThemedText style={[styles.commentText, { color: theme.text }]}>
                        {comment.content}
                      </ThemedText>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyComments}>
                  <ThemedText themeColor="textSecondary">
                    No comments yet. Be the first to comment!
                  </ThemedText>
                </View>
              )}
            </ScrollView>

            {/* Comment Input Footer */}
            <View
              style={[
                styles.commentInputRow,
                { borderTopColor: theme.backgroundSelected, paddingBottom: insets.bottom + Spacing.two },
              ]}>
              <TextInput
                style={[
                  styles.commentInput,
                  { color: theme.text, borderColor: theme.backgroundSelected },
                ]}
                placeholder="Write a comment..."
                placeholderTextColor={theme.textSecondary}
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <Pressable
                style={[
                  styles.sendButton,
                  !newCommentText.trim() && { backgroundColor: theme.backgroundSelected },
                ]}
                disabled={!newCommentText.trim()}
                onPress={handleAddComment}>
                <SymbolView name="paperplane.fill" size={14} tintColor="#ffffff" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  headerUserAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerUserAvatarText: {
    color: '#1E7C9A',
    fontSize: 12,
  },
  headerUserInfo: {
    alignItems: 'flex-start',
  },
  headerUserName: {
    color: '#ffffff',
    fontSize: 11,
  },
  headerUserRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: 1,
  },
  hrBadge: {
    backgroundColor: '#4CAF50',
  },
  employeeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerUserRoleText: {
    color: '#ffffff',
    fontSize: 8,
  },
  listContainer: {
    paddingTop: Spacing.one,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  headerComponentWrapper: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 120,
    height: 40,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 24,
    fontSize: 14,
  },
  createPostCard: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  toolbarButton: {
    padding: Spacing.two,
    borderRadius: Spacing.one,
  },
  toolbarButtonActive: {
    backgroundColor: 'rgba(30, 124, 154, 0.1)',
  },
  toolbarTextBold: {
    fontWeight: '800',
    fontSize: 14,
  },
  toolbarTextItalic: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  toolbarTextUnderline: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  toolbarDivider: {
    width: StyleSheet.hairlineWidth,
    height: 16,
    marginHorizontal: Spacing.one,
  },
  createPostInput: {
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: Spacing.three,
  },
  uploadedImagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.one,
    marginBottom: Spacing.three,
  },
  addMediaArea: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  uploadMainText: {
    color: '#1E7C9A',
    fontSize: 12,
    marginTop: Spacing.two,
  },
  uploadSubText: {
    fontSize: 10,
    marginTop: Spacing.one,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postButton: {
    backgroundColor: '#1E7C9A',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#ffffff',
  },
  postCard: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  avatarContainer: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: '#1E7C9A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  authorName: {
    fontSize: 13,
  },
  authorRole: {
    fontSize: 11,
    marginTop: 1,
  },
  threeDotsButton: {
    padding: Spacing.two,
  },
  postBody: {
    marginBottom: Spacing.three,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  mediaPlaceholder: {
    height: 180,
    width: '100%',
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPlaceholderText: {
    fontSize: 12,
    marginTop: Spacing.two,
  },
  postDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Spacing.two,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    gap: Spacing.two,
  },
  actionCount: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: Spacing.three,
    padding: Spacing.four,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: Spacing.three,
  },
  modalItem: {
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  drawerDismissZone: {
    flex: 1,
  },
  drawerContent: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    height: '75%',
    padding: Spacing.four,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentAvatar: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: '#1E7C9A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  commentBody: {
    flex: 1,
  },
  commentHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyComments: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 13,
  },
  sendButton: {
    backgroundColor: '#1E7C9A',
    width: 40,
    height: 40,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

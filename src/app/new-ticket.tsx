import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
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

type TicketType = 'vacation' | 'licence' | 'letter';
type PriorityType = 'Low' | 'Medium' | 'High';

interface Attachment {
  id: string;
  name: string;
  size: string;
}

const MOCK_FILES: Attachment[] = [
  { id: '1', name: 'medical_certificate.jpg', size: '420 KB' },
  { id: '2', name: 'drivers_license_front.png', size: '310 KB' },
  { id: '3', name: 'professional_certification.pdf', size: '1.2 MB' },
  { id: '4', name: 'visa_document_scan.jpg', size: '890 KB' },
];

export default function NewTicketScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Shared form states
  const [ticketType, setTicketType] = useState<TicketType>('vacation');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityType>('Low');
  const [message, setMessage] = useState('');

  // Vacation fields
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [activeDatePicker, setActiveDatePicker] = useState<'start' | 'end' | null>(null);

  // Licence fields
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  // Letter of Employment fields
  const [purpose, setPurpose] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'digital' | 'printed'>('digital');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSelectMockFile = (file: Attachment) => {
    if (!attachments.some((item) => item.id === file.id)) {
      setAttachments([...attachments, file]);
    }
    setShowAttachmentModal(false);
    // Clear attachment error if present
    if (errors.attachments) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.attachments;
        return copy;
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((item) => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!message.trim()) {
      newErrors.message = 'Description/Message is required';
    }

    if (ticketType === 'vacation') {
      if (!startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (startDate && endDate) {
        const startDay = parseInt(startDate.split(' ')[1], 10);
        const endDay = parseInt(endDate.split(' ')[1], 10);
        if (endDay <= startDay) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    } else if (ticketType === 'licence') {
      if (attachments.length === 0) {
        newErrors.attachments = 'At least one license document is required';
      }
    } else if (ticketType === 'letter') {
      if (!purpose.trim()) {
        newErrors.purpose = 'Purpose of the letter is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      // Close the modal and set the success search param on the tickets page
      router.replace('/(tabs)/tickets?ticketCreated=true');
    }, 1200);
  };

  // Custom mock calendar for June 2026
  // June 1st, 2026 is a Monday. Total days = 30.
  const juneDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleSelectDay = (day: number) => {
    const formattedDate = `June ${day}, 2026`;
    if (activeDatePicker === 'start') {
      setStartDate(formattedDate);
      if (errors.startDate) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.startDate;
          return copy;
        });
      }
    } else {
      setEndDate(formattedDate);
      if (errors.endDate) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.endDate;
          return copy;
        });
      }
    }
    setActiveDatePicker(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <ScreenHeader
        title="Add New Ticket"
        subtitle="Submit a request to human resources"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Ticket Type Selector Card */}
        <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            Request Type
          </ThemedText>
          <View style={styles.typeSelectorRow}>
            {/* Vacation */}
            <Pressable
              style={[
                styles.typeOption,
                { borderColor: theme.backgroundSelected },
                ticketType === 'vacation' && styles.typeOptionSelected,
              ]}
              onPress={() => {
                setTicketType('vacation');
                setErrors({});
              }}>
              <SymbolView
                name="calendar"
                size={22}
                tintColor={ticketType === 'vacation' ? '#1E7C9A' : theme.textSecondary}
              />
              <ThemedText
                type="smallBold"
                style={[
                  styles.typeOptionText,
                  ticketType === 'vacation' && { color: '#1E7C9A' },
                ]}>
                Vacation
              </ThemedText>
            </Pressable>

            {/* Licence */}
            <Pressable
              style={[
                styles.typeOption,
                { borderColor: theme.backgroundSelected },
                ticketType === 'licence' && styles.typeOptionSelected,
              ]}
              onPress={() => {
                setTicketType('licence');
                setErrors({});
              }}>
              <SymbolView
                name="doc.text"
                size={22}
                tintColor={ticketType === 'licence' ? '#1E7C9A' : theme.textSecondary}
              />
              <ThemedText
                type="smallBold"
                style={[
                  styles.typeOptionText,
                  ticketType === 'licence' && { color: '#1E7C9A' },
                ]}>
                Licence
              </ThemedText>
            </Pressable>

            {/* Letter */}
            <Pressable
              style={[
                styles.typeOption,
                { borderColor: theme.backgroundSelected },
                ticketType === 'letter' && styles.typeOptionSelected,
              ]}
              onPress={() => {
                setTicketType('letter');
                setErrors({});
              }}>
              <SymbolView
                name="envelope"
                size={22}
                tintColor={ticketType === 'letter' ? '#1E7C9A' : theme.textSecondary}
              />
              <ThemedText
                type="smallBold"
                style={[
                  styles.typeOptionText,
                  ticketType === 'letter' && { color: '#1E7C9A' },
                ]}>
                Employment Letter
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Core Form Card */}
        <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            Ticket Information
          </ThemedText>

          {/* Title input */}
          <View style={styles.inputGroup}>
            <ThemedText type="smallBold" style={styles.inputLabel}>
              Title
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { color: theme.text, borderColor: errors.title ? '#D32F2F' : theme.backgroundSelected },
              ]}
              placeholder="e.g., Summer vacation request"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
            />
            {errors.title ? <ThemedText style={styles.errorText}>{errors.title}</ThemedText> : null}
          </View>

          {/* Priority Selection */}
          <View style={styles.inputGroup}>
            <ThemedText type="smallBold" style={styles.inputLabel}>
              Priority
            </ThemedText>
            <View style={styles.priorityRow}>
              {(['Low', 'Medium', 'High'] as PriorityType[]).map((p) => {
                const isActive = priority === p;
                let activeBg: string = theme.backgroundSelected;
                let activeText: string = theme.text;
                if (isActive) {
                  if (p === 'Low') { activeBg = '#E8F5E9'; activeText = '#388E3C'; }
                  else if (p === 'Medium') { activeBg = '#FFF3E0'; activeText = '#F57C00'; }
                  else { activeBg = '#FFEBEE'; activeText = '#D32F2F'; }
                }
                return (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityButton,
                      { borderColor: theme.backgroundSelected },
                      isActive && { backgroundColor: activeBg, borderColor: activeText },
                    ]}
                    onPress={() => setPriority(p)}>
                    <ThemedText
                      type="smallBold"
                      style={[
                        { color: theme.textSecondary },
                        isActive && { color: activeText },
                      ]}>
                      {p}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <ThemedText type="smallBold" style={styles.inputLabel}>
              Message / Description
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { color: theme.text, borderColor: errors.message ? '#D32F2F' : theme.backgroundSelected },
              ]}
              placeholder="Describe your request in detail..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
              }}
            />
            {errors.message ? <ThemedText style={styles.errorText}>{errors.message}</ThemedText> : null}
          </View>
        </View>

        {/* Dynamic Context Card */}
        {ticketType === 'vacation' && (
          <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Vacation Dates (June 2026)
            </ThemedText>

            <View style={styles.datePickerRow}>
              {/* Start Date */}
              <View style={styles.dateFieldWrapper}>
                <ThemedText type="smallBold" style={styles.inputLabel}>
                  Start Date
                </ThemedText>
                <Pressable
                  style={[
                    styles.dateInputButton,
                    { borderColor: errors.startDate ? '#D32F2F' : theme.backgroundSelected },
                  ]}
                  onPress={() => setActiveDatePicker('start')}>
                  <ThemedText style={{ color: startDate ? theme.text : theme.textSecondary }}>
                    {startDate || 'Select Date'}
                  </ThemedText>
                  <SymbolView name="calendar" size={16} tintColor={theme.textSecondary} />
                </Pressable>
                {errors.startDate ? <ThemedText style={styles.errorText}>{errors.startDate}</ThemedText> : null}
              </View>

              {/* End Date */}
              <View style={styles.dateFieldWrapper}>
                <ThemedText type="smallBold" style={styles.inputLabel}>
                  End Date
                </ThemedText>
                <Pressable
                  style={[
                    styles.dateInputButton,
                    { borderColor: errors.endDate ? '#D32F2F' : theme.backgroundSelected },
                  ]}
                  onPress={() => setActiveDatePicker('end')}>
                  <ThemedText style={{ color: endDate ? theme.text : theme.textSecondary }}>
                    {endDate || 'Select Date'}
                  </ThemedText>
                  <SymbolView name="calendar" size={16} tintColor={theme.textSecondary} />
                </Pressable>
                {errors.endDate ? <ThemedText style={styles.errorText}>{errors.endDate}</ThemedText> : null}
              </View>
            </View>
          </View>
        )}

        {ticketType === 'licence' && (
          <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              License Verification File
            </ThemedText>

            {/* Attachments Section */}
            {attachments.length > 0 && (
              <View style={styles.attachmentsList}>
                {attachments.map((file) => (
                  <View
                    key={file.id}
                    style={[styles.attachmentItem, { borderColor: theme.backgroundSelected }]}>
                    <SymbolView name="doc.text" size={18} tintColor={theme.textSecondary} />
                    <View style={styles.attachmentDetails}>
                      <ThemedText type="smallBold" style={styles.attachmentName}>
                        {file.name}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {file.size}
                      </ThemedText>
                    </View>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemoveAttachment(file.id)}>
                      <SymbolView name="xmark.circle.fill" size={18} tintColor="#D32F2F" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              style={[
                styles.uploadButton,
                { borderColor: errors.attachments ? '#D32F2F' : '#1E7C9A' },
              ]}
              onPress={() => setShowAttachmentModal(true)}>
              <SymbolView name="plus" size={14} tintColor="#1E7C9A" />
              <ThemedText type="smallBold" style={styles.uploadButtonText}>
                Add Attachment
              </ThemedText>
            </Pressable>
            {errors.attachments ? <ThemedText style={styles.errorText}>{errors.attachments}</ThemedText> : null}
          </View>
        )}

        {ticketType === 'letter' && (
          <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Letter of Employment Details
            </ThemedText>

            {/* Purpose input */}
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.inputLabel}>
                Purpose of Letter
              </ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { color: theme.text, borderColor: errors.purpose ? '#D32F2F' : theme.backgroundSelected },
                ]}
                placeholder="e.g., Bank Loan, Visa Application"
                placeholderTextColor={theme.textSecondary}
                value={purpose}
                onChangeText={(text) => {
                  setPurpose(text);
                  if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: '' }));
                }}
              />
              {errors.purpose ? <ThemedText style={styles.errorText}>{errors.purpose}</ThemedText> : null}
            </View>

            {/* Delivery Method */}
            <View style={styles.inputGroup}>
              <ThemedText type="smallBold" style={styles.inputLabel}>
                Delivery Format
              </ThemedText>
              <View style={styles.deliverySelector}>
                <Pressable
                  style={[
                    styles.deliveryOption,
                    { borderColor: theme.backgroundSelected },
                    deliveryMethod === 'digital' && styles.deliveryOptionActive,
                  ]}
                  onPress={() => setDeliveryMethod('digital')}>
                  <SymbolView
                    name="paperplane"
                    size={16}
                    tintColor={deliveryMethod === 'digital' ? '#1E7C9A' : theme.textSecondary}
                  />
                  <ThemedText
                    type="smallBold"
                    style={[
                      styles.deliveryOptionText,
                      deliveryMethod === 'digital' && { color: '#1E7C9A' },
                    ]}>
                    Digital PDF (Email)
                  </ThemedText>
                </Pressable>

                <Pressable
                  style={[
                    styles.deliveryOption,
                    { borderColor: theme.backgroundSelected },
                    deliveryMethod === 'printed' && styles.deliveryOptionActive,
                  ]}
                  onPress={() => setDeliveryMethod('printed')}>
                  <SymbolView
                    name="printer"
                    size={16}
                    tintColor={deliveryMethod === 'printed' ? '#1E7C9A' : theme.textSecondary}
                  />
                  <ThemedText
                    type="smallBold"
                    style={[
                      styles.deliveryOptionText,
                      deliveryMethod === 'printed' && { color: '#1E7C9A' },
                    ]}>
                    Printed copy (HR)
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Submit Actions */}
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.btnCancel, { borderColor: theme.backgroundSelected }]}
            onPress={() => router.back()}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Cancel
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.btnSubmit}
            disabled={isSubmitting}
            onPress={handleSubmit}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <ThemedText type="smallBold" style={styles.btnSubmitText}>
                Submit Request
              </ThemedText>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={activeDatePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveDatePicker(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                Select {activeDatePicker === 'start' ? 'Start' : 'End'} Date
              </ThemedText>
              <Pressable onPress={() => setActiveDatePicker(null)}>
                <SymbolView name="xmark" size={20} tintColor={theme.text} />
              </Pressable>
            </View>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.calendarSubheader}>
              June 2026
            </ThemedText>
            <View style={styles.calendarGrid}>
              {juneDays.map((day) => (
                <Pressable
                  key={day}
                  style={styles.calendarDay}
                  onPress={() => handleSelectDay(day)}>
                  <ThemedText style={styles.calendarDayText}>{day}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Attachment Picker Modal */}
      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                Choose Document to Upload
              </ThemedText>
              <Pressable onPress={() => setShowAttachmentModal(false)}>
                <SymbolView name="xmark" size={20} tintColor={theme.text} />
              </Pressable>
            </View>
            <View style={styles.modalList}>
              {MOCK_FILES.map((file) => (
                <Pressable
                  key={file.id}
                  style={[styles.modalListItem, { borderColor: theme.backgroundSelected }]}
                  onPress={() => handleSelectMockFile(file)}>
                  <SymbolView name="doc.fill" size={20} tintColor="#1E7C9A" />
                  <View style={styles.modalListDetails}>
                    <ThemedText type="smallBold">{file.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {file.size}
                    </ThemedText>
                  </View>
                </Pressable>
              ))}
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
  scrollContent: {
    paddingTop: Spacing.one,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: Spacing.three,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  typeOption: {
    flex: 1,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
    gap: Spacing.one,
  },
  typeOptionSelected: {
    borderColor: '#1E7C9A',
    backgroundColor: 'rgba(30, 124, 154, 0.08)',
  },
  typeOptionText: {
    fontSize: 11,
    color: '#60646C',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.four,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  priorityButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.one,
    borderWidth: 1,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  dateFieldWrapper: {
    flex: 1,
  },
  dateInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Spacing.two,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  uploadButtonText: {
    color: '#1E7C9A',
  },
  attachmentsList: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  attachmentDetails: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
  },
  removeButton: {
    padding: Spacing.one,
  },
  deliverySelector: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  deliveryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    borderRadius: Spacing.one,
    gap: Spacing.two,
  },
  deliveryOptionActive: {
    borderColor: '#1E7C9A',
    backgroundColor: 'rgba(30, 124, 154, 0.05)',
  },
  deliveryOptionText: {
    fontSize: 12,
    color: '#60646C',
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  btnCancel: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  btnSubmit: {
    flex: 2,
    backgroundColor: '#1E7C9A', // Beautiful Premium Coral Red Color
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
  },
  btnSubmitDisabled: {
    backgroundColor: '#FFA294',
  },
  btnSubmitText: {
    color: '#ffffff',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 11,
    marginTop: Spacing.one,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  calendarSubheader: {
    fontSize: 14,
    marginBottom: Spacing.three,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  calendarDay: {
    width: '12%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.one,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    marginBottom: Spacing.one,
  },
  calendarDayText: {
    fontSize: 12,
  },
  modalList: {
    gap: Spacing.two,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
  modalListDetails: {
    flex: 1,
  },

});

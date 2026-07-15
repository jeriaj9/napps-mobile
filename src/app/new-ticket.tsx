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

type TicketType = 'vacation' | 'licence' | 'letter' | 'overtime';

interface Attachment {
  id: string;
  name: string;
  size: string;
}

const MOCK_FILES: Attachment[] = [
  { id: '1', name: 'medical_certificate.jpg', size: '420 KB' },
  { id: '2', name: 'doctors_note_scan.pdf', size: '680 KB' },
  { id: '3', name: 'professional_certification.pdf', size: '1.2 MB' },
  { id: '4', name: 'visa_document_scan.jpg', size: '890 KB' },
];

export default function NewTicketScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Navigation step state: 'select' | 'form'
  const [step, setStep] = useState<'select' | 'form'>('select');

  // Shared form states
  const [ticketType, setTicketType] = useState<TicketType>('vacation');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Vacation fields
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectingDateType, setSelectingDateType] = useState<'start' | 'end'>('start');

  // Sick Leave (Licence) fields
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  // Letter of Employment fields
  const [purpose, setPurpose] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'digital' | 'printed'>('digital');

  // Overtime fields
  const [overtimeDate, setOvertimeDate] = useState<string | null>(null);
  const [overtimeHours, setOvertimeHours] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSelectMockFile = (file: Attachment) => {
    if (!attachments.some((item) => item.id === file.id)) {
      setAttachments([...attachments, file]);
    }
    setShowAttachmentModal(false);
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
        newErrors.attachments = 'Supporting medical document is required';
      }
    } else if (ticketType === 'letter') {
      if (!purpose.trim()) {
        newErrors.purpose = 'Purpose of the letter is required';
      }
    } else if (ticketType === 'overtime') {
      if (!overtimeDate) {
        newErrors.overtimeDate = 'Overtime date is required';
      }
      if (!overtimeHours.trim()) {
        newErrors.overtimeHours = 'Hours are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/(tabs)/tickets?ticketCreated=true');
    }, 1200);
  };

  const juneDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleSelectDay = (day: number) => {
    const formattedDate = `June ${day}, 2026`;

    if (selectingDateType === 'start') {
      setStartDate(formattedDate);
      if (errors.startDate) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.startDate;
          return copy;
        });
      }
      setShowDatePickerModal(false);
    } else {
      setEndDate(formattedDate);
      if (errors.endDate) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.endDate;
          return copy;
        });
      }
      setShowDatePickerModal(false);
    }
  };

  const selectOption = (type: TicketType) => {
    setTicketType(type);
    setErrors({});

    // Set default titles for convenience
    if (type === 'vacation') {
      setTitle('Request Vacation Days');
    } else if (type === 'licence') {
      setTitle('Request Sick Leave');
    } else if (type === 'overtime') {
      setTitle('Request Overtime Compensation');
    } else if (type === 'letter') {
      setTitle('Request Employment Letter');
    }

    setStep('form');
  };

  const renderSelectStep = () => {
    return (
      <View style={styles.stepContainer}>
        <ScreenHeader
          title="New Request"
          onBackPress={() => router.back()}
        />
        <View style={styles.selectHeader}>
          <ThemedText style={styles.selectHeaderText}>Select a request type to get started</ThemedText>
        </View>

        <View style={styles.optionsCard}>
          {/* Vacation Days */}
          <Pressable style={styles.optionRow} onPress={() => selectOption('vacation')}>
            <View style={[styles.optionIconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <SymbolView name="calendar" size={22} tintColor="#1EBD60" />
            </View>
            <View style={styles.optionTextWrapper}>
              <ThemedText style={styles.optionTitle}>Vacation Days</ThemedText>
              <ThemedText style={styles.optionDesc}>Request time off for vacation</ThemedText>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#8E8E93" />
          </Pressable>

          <View style={styles.optionDivider} />

          {/* Sick Leave */}
          <Pressable style={styles.optionRow} onPress={() => selectOption('licence')}>
            <View style={[styles.optionIconWrapper, { backgroundColor: '#FFEBEE' }]}>
              <SymbolView name="heart" size={20} tintColor="#FF3B30" />
            </View>
            <View style={styles.optionTextWrapper}>
              <ThemedText style={styles.optionTitle}>Sick Leave</ThemedText>
              <ThemedText style={styles.optionDesc}>Report sick leave absence</ThemedText>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#8E8E93" />
          </Pressable>

          <View style={styles.optionDivider} />

          {/* Overtime */}
          <Pressable style={styles.optionRow} onPress={() => selectOption('overtime')}>
            <View style={[styles.optionIconWrapper, { backgroundColor: '#FFF3E0' }]}>
              <SymbolView name="clock" size={20} tintColor="#FF9500" />
            </View>
            <View style={styles.optionTextWrapper}>
              <ThemedText style={styles.optionTitle}>Overtime</ThemedText>
              <ThemedText style={styles.optionDesc}>Request overtime compensation</ThemedText>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#8E8E93" />
          </Pressable>

          <View style={styles.optionDivider} />

          {/* Company Letter */}
          <Pressable style={styles.optionRow} onPress={() => selectOption('letter')}>
            <View style={[styles.optionIconWrapper, { backgroundColor: '#E3F2FD' }]}>
              <SymbolView name="doc.text" size={20} tintColor="#007AFF" />
            </View>
            <View style={styles.optionTextWrapper}>
              <ThemedText style={styles.optionTitle}>Company Letter</ThemedText>
              <ThemedText style={styles.optionDesc}>Request official company letter</ThemedText>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#8E8E93" />
          </Pressable>
        </View>
      </View>
    );
  };

  const getFormTitle = () => {
    switch (ticketType) {
      case 'vacation': return 'Request Vacation Days';
      case 'licence': return 'Request Sick Leave';
      case 'overtime': return 'Request Overtime';
      case 'letter': return 'Request Company Letter';
    }
  };

  const renderFormStep = () => {
    return (
      <View style={styles.stepContainer}>
        <ScreenHeader
          title={getFormTitle()}
          onBackPress={() => setStep('select')}
        />

        <ScrollView
          contentContainerStyle={[styles.formScrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Vacation Days Available Circular Progress Gauge */}
          {ticketType === 'vacation' && (
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeCircle}>
                <ThemedText style={styles.gaugeNumber}>12</ThemedText>
                <ThemedText style={styles.gaugeLabel}>DAYS AVAILABLE</ThemedText>
              </View>
              <View style={styles.gaugeStatsRow}>
                <ThemedText style={styles.gaugeStatText}>Used this year</ThemedText>
                <ThemedText style={styles.gaugeStatValue}>8 days</ThemedText>
              </View>
              <View style={styles.gaugeStatsDivider} />
              <View style={styles.gaugeStatsRow}>
                <ThemedText style={styles.gaugeStatText}>Total allocation</ThemedText>
                <ThemedText style={styles.gaugeStatValue}>20 days</ThemedText>
              </View>
            </View>
          )}

          {/* Form Content Card */}
          <View style={styles.formCard}>
            {/* Vacation Dates selection fields */}
            {ticketType === 'vacation' && (
              <View style={styles.formSection}>
                <ThemedText style={styles.inputLabel}>FROM</ThemedText>
                <Pressable
                  style={[styles.dateInputButton, errors.startDate && styles.inputErrorBorder]}
                  onPress={() => {
                    setSelectingDateType('start');
                    setShowDatePickerModal(true);
                  }}
                >
                  <ThemedText style={[styles.dateInputText, !startDate && { color: '#9E9E9E' }]}>
                    {startDate || 'mm/dd/yyyy'}
                  </ThemedText>
                  <SymbolView name="calendar" size={18} tintColor="#8E8E93" />
                </Pressable>
                {errors.startDate ? <ThemedText style={styles.errorText}>{errors.startDate}</ThemedText> : null}

                <ThemedText style={[styles.inputLabel, { marginTop: Spacing.four }]}>TO</ThemedText>
                <Pressable
                  style={[styles.dateInputButton, errors.endDate && styles.inputErrorBorder]}
                  onPress={() => {
                    setSelectingDateType('end');
                    setShowDatePickerModal(true);
                  }}
                >
                  <ThemedText style={[styles.dateInputText, !endDate && { color: '#9E9E9E' }]}>
                    {endDate || 'mm/dd/yyyy'}
                  </ThemedText>
                  <SymbolView name="calendar" size={18} tintColor="#8E8E93" />
                </Pressable>
                {errors.endDate ? <ThemedText style={styles.errorText}>{errors.endDate}</ThemedText> : null}
              </View>
            )}

            {/* Sick Leave / Attachment upload fields */}
            {ticketType === 'licence' && (
              <View style={styles.formSection}>
                <ThemedText style={styles.inputLabel}>MEDICAL CERTIFICATE / DOCUMENT</ThemedText>
                {attachments.map((file) => (
                  <View key={file.id} style={styles.attachmentItem}>
                    <SymbolView name="doc.text" size={18} tintColor="#8E8E93" />
                    <View style={styles.attachmentDetails}>
                      <ThemedText style={styles.attachmentName}>{file.name}</ThemedText>
                      <ThemedText style={styles.attachmentSize}>{file.size}</ThemedText>
                    </View>
                    <Pressable style={styles.removeAttachmentBtn} onPress={() => handleRemoveAttachment(file.id)}>
                      <SymbolView name="xmark.circle.fill" size={18} tintColor="#FF3B30" />
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={[styles.uploadButton, errors.attachments && styles.inputErrorBorder]}
                  onPress={() => setShowAttachmentModal(true)}
                >
                  <SymbolView name="plus" size={14} tintColor="#1EBD60" />
                  <ThemedText style={styles.uploadButtonText}>Upload document</ThemedText>
                </Pressable>
                {errors.attachments ? <ThemedText style={styles.errorText}>{errors.attachments}</ThemedText> : null}
              </View>
            )}

            {/* Overtime hours / date fields */}
            {ticketType === 'overtime' && (
              <View style={styles.formSection}>
                <ThemedText style={styles.inputLabel}>OVERTIME DATE</ThemedText>
                <Pressable
                  style={[styles.dateInputButton, errors.overtimeDate && styles.inputErrorBorder]}
                  onPress={() => {
                    setSelectingDateType('start'); // reutilizamos modal de junio
                    setShowDatePickerModal(true);
                  }}
                >
                  <ThemedText style={[styles.dateInputText, !overtimeDate && { color: '#9E9E9E' }]}>
                    {startDate || 'Select Date'}
                  </ThemedText>
                  <SymbolView name="calendar" size={18} tintColor="#8E8E93" />
                </Pressable>
                {errors.overtimeDate ? <ThemedText style={styles.errorText}>{errors.overtimeDate}</ThemedText> : null}

                <ThemedText style={[styles.inputLabel, { marginTop: Spacing.four }]}>HOURS WORKED</ThemedText>
                <TextInput
                  style={[styles.textInput, errors.overtimeHours && styles.inputErrorBorder]}
                  placeholder="e.g. 4.5"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="numeric"
                  value={overtimeHours}
                  onChangeText={(text) => {
                    setOvertimeHours(text);
                    if (errors.overtimeHours) setErrors((prev) => ({ ...prev, overtimeHours: '' }));
                  }}
                />
                {errors.overtimeHours ? <ThemedText style={styles.errorText}>{errors.overtimeHours}</ThemedText> : null}
              </View>
            )}

            {/* Company Letter purpose / delivery fields */}
            {ticketType === 'letter' && (
              <View style={styles.formSection}>
                <ThemedText style={styles.inputLabel}>PURPOSE OF LETTER</ThemedText>
                <TextInput
                  style={[styles.textInput, errors.purpose && styles.inputErrorBorder]}
                  placeholder="e.g. Bank Loan, Visa Application"
                  placeholderTextColor="#9E9E9E"
                  value={purpose}
                  onChangeText={(text) => {
                    setPurpose(text);
                    if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: '' }));
                  }}
                />
                {errors.purpose ? <ThemedText style={styles.errorText}>{errors.purpose}</ThemedText> : null}

                <ThemedText style={[styles.inputLabel, { marginTop: Spacing.four }]}>DELIVERY FORMAT</ThemedText>
                <View style={styles.deliverySelector}>
                  <Pressable
                    style={[styles.deliveryOption, deliveryMethod === 'digital' && styles.deliveryOptionActive]}
                    onPress={() => setDeliveryMethod('digital')}
                  >
                    <SymbolView name="paperplane" size={16} tintColor={deliveryMethod === 'digital' ? '#1EBD60' : '#8E8E93'} />
                    <ThemedText style={[styles.deliveryText, deliveryMethod === 'digital' && { color: '#1EBD60' }]}>Digital PDF (Email)</ThemedText>
                  </Pressable>

                  <Pressable
                    style={[styles.deliveryOption, deliveryMethod === 'printed' && styles.deliveryOptionActive]}
                    onPress={() => setDeliveryMethod('printed')}
                  >
                    <SymbolView name="printer" size={16} tintColor={deliveryMethod === 'printed' ? '#1EBD60' : '#8E8E93'} />
                    <ThemedText style={[styles.deliveryText, deliveryMethod === 'printed' && { color: '#1EBD60' }]}>Printed copy (HR)</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Description/Message input */}
            <ThemedText style={[styles.inputLabel, { marginTop: Spacing.four }]}>REASON (OPTIONAL)</ThemedText>
            <TextInput
              style={[styles.textArea, errors.message && styles.inputErrorBorder]}
              placeholder="Add any notes about your request..."
              placeholderTextColor="#9E9E9E"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
              }}
            />
            {errors.message ? <ThemedText style={styles.errorText}>{errors.message}</ThemedText> : null}

            {/* Submit Actions */}
            <Pressable
              style={[styles.btnSubmit, isSubmitting && styles.btnSubmitDisabled]}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <ThemedText type="smallBold" style={styles.btnSubmitText}>
                  Submit Request
                </ThemedText>
              )}
            </Pressable>

            {/* Supervisor review notice */}
            <ThemedText style={styles.formNoticeText}>
              Your supervisor will review this request and notify you of the decision.
            </ThemedText>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      {step === 'select' ? renderSelectStep() : renderFormStep()}

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Date (June 2026)</ThemedText>
              <Pressable onPress={() => setShowDatePickerModal(false)}>
                <SymbolView name="xmark" size={20} tintColor="#000000" />
              </Pressable>
            </View>

            <ThemedText style={styles.calendarSubheader}>June 2026</ThemedText>

            <View style={styles.calendarGrid}>
              {juneDays.map((day) => {
                const isSelected = selectingDateType === 'start'
                  ? startDate === `June ${day}, 2026`
                  : endDate === `June ${day}, 2026`;

                return (
                  <Pressable
                    key={day}
                    style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
                    onPress={() => {
                      if (ticketType === 'overtime') {
                        setOvertimeDate(`June ${day}, 2026`);
                        setStartDate(`June ${day}, 2026`);
                      }
                      handleSelectDay(day);
                    }}
                  >
                    <ThemedText style={[styles.calendarDayText, isSelected && { color: '#ffffff', fontWeight: '700' }]}>
                      {day}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Attachment Picker Modal */}
      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Choose Document to Upload</ThemedText>
              <Pressable onPress={() => setShowAttachmentModal(false)}>
                <SymbolView name="xmark" size={20} tintColor="#000000" />
              </Pressable>
            </View>
            <View style={styles.modalList}>
              {MOCK_FILES.map((file) => (
                <Pressable
                  key={file.id}
                  style={styles.modalListItem}
                  onPress={() => handleSelectMockFile(file)}
                >
                  <SymbolView name="doc.fill" size={20} tintColor="#1EBD60" />
                  <View style={styles.modalListDetails}>
                    <ThemedText type="smallBold">{file.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{file.size}</ThemedText>
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
  stepContainer: {
    flex: 1,
  },
  selectHeader: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  selectHeaderText: {
    fontSize: 16,
    color: '#60646C',
    fontWeight: '600',
  },
  optionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginHorizontal: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  optionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextWrapper: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  optionDesc: {
    fontSize: 13,
    color: '#8E8E93',
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginLeft: Spacing.four + 44 + Spacing.three,
  },
  formScrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingTop: Spacing.three,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: Spacing.four,
  },
  gaugeCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 9,
    borderColor: '#EFEFEF',
    borderTopColor: '#1EBD60',
    borderRightColor: '#1EBD60',
    borderBottomColor: '#1EBD60',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    marginVertical: Spacing.three,
  },
  gaugeNumber: {
    fontSize: 32,
    paddingTop: 8,
    fontWeight: '800',
    color: '#000000',
    transform: [{ rotate: '-45deg' }], // rotate text back
  },
  gaugeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginTop: 2,
    transform: [{ rotate: '-45deg' }], // rotate text back
  },
  gaugeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: Spacing.two,
  },
  gaugeStatText: {
    fontSize: 14,
    color: '#60646C',
  },
  gaugeStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  gaugeStatsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    width: '100%',
  },
  formCard: {
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
  },
  formSection: {
    gap: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: Spacing.two,
  },
  dateInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#F7F8FA',
  },
  dateInputText: {
    fontSize: 15,
    color: '#000000',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    backgroundColor: '#F7F8FA',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
    height: 100,
    backgroundColor: '#F7F8FA',
    textAlignVertical: 'top',
    marginBottom: Spacing.four,
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: Spacing.one,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  attachmentDetails: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '600',
  },
  attachmentSize: {
    fontSize: 11,
    color: '#8E8E93',
  },
  removeAttachmentBtn: {
    padding: Spacing.one,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#1EBD60',
    borderRadius: 8,
    gap: Spacing.two,
    backgroundColor: '#E8F5E9',
  },
  uploadButtonText: {
    color: '#1EBD60',
    fontWeight: '700',
    fontSize: 14,
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
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    gap: Spacing.two,
    backgroundColor: '#F7F8FA',
  },
  deliveryOptionActive: {
    borderColor: '#1EBD60',
    backgroundColor: '#E8F5E9',
  },
  deliveryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60646C',
  },
  btnSubmit: {
    backgroundColor: '#1EBD60',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: Spacing.three,
  },
  btnSubmitDisabled: {
    opacity: 0.5,
  },
  btnSubmitText: {
    color: '#ffffff',
    fontSize: 16,
  },
  formNoticeText: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.four,
    lineHeight: 16,
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
    maxWidth: 360,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    backgroundColor: '#ffffff',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  calendarSubheader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: Spacing.three,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '12%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: Spacing.two,
  },
  calendarDaySelected: {
    backgroundColor: '#1EBD60',
    borderColor: '#1EBD60',
  },
  calendarDayText: {
    fontSize: 12,
    color: '#000000',
  },
  modalList: {
    gap: Spacing.two,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    borderRadius: 8,
    gap: Spacing.three,
  },
  modalListDetails: {
    flex: 1,
  },
});

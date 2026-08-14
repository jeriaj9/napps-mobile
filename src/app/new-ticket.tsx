import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useCallback, useEffect, useState } from 'react';
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
import {
  DynamicFormFields,
  cleanDefaultValue,
  parseCustomFieldOptions,
} from '@/components/tickets/DynamicFormFields';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  CustomField,
  RequestType,
  TicketCategory,
  createTicket,
  fetchTicketsCategories,
} from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';

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

function getIconForCategoryOrRequest(categoryName: string, requestTypeName: string, iconStr?: string) {
  const combined = `${categoryName} ${requestTypeName} ${iconStr || ''}`.toLowerCase();

  if (combined.includes('vacation') || combined.includes('vacaciones')) {
    return { name: 'calendar' as const, bg: '#E8F5E9', tint: '#1EBD60' };
  }
  if (combined.includes('sick') || combined.includes('licence') || combined.includes('salud') || combined.includes('heart')) {
    return { name: 'heart' as const, bg: '#FFEBEE', tint: '#FF3B30' };
  }
  if (combined.includes('ot') || combined.includes('overtime') || combined.includes('extra') || combined.includes('clock')) {
    return { name: 'clock' as const, bg: '#FFF3E0', tint: '#FF9500' };
  }
  if (combined.includes('hr') || combined.includes('users') || combined.includes('carta') || combined.includes('letter') || combined.includes('document')) {
    return { name: 'doc.text' as const, bg: '#E3F2FD', tint: '#007AFF' };
  }
  if (combined.includes('textbox') || combined.includes('cusfield') || combined.includes('test') || combined.includes('custom')) {
    return { name: 'square.and.pencil' as const, bg: '#F3E5F5', tint: '#9C27B0' };
  }
  return { name: 'folder' as const, bg: '#EBF8FF', tint: '#3182CE' };
}

export default function NewTicketScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accessToken } = useAuthStore();

  // Navigation step state: 'select' | 'form'
  const [step, setStep] = useState<'select' | 'form'>('select');

  // Categories state from API
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);

  // Dynamic form state
  const [dynamicValues, setDynamicValues] = useState<Record<number, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [attachmentsByField, setAttachmentsByField] = useState<Record<number, Attachment[]>>({});
  const [generalComment, setGeneralComment] = useState<string>('');

  // Date Picker Modal state
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false);
  const [activeDateFieldId, setActiveDateFieldId] = useState<number | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState<boolean>(false);
  const [rangeStartDate, setRangeStartDate] = useState<string | null>(null);

  // Attachment Modal state
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [activeFileFieldId, setActiveFileFieldId] = useState<number | null>(null);

  // Submit loading
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load ticket categories strictly from API
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      if (accessToken) {
        const fetched = await fetchTicketsCategories(accessToken);
        setCategories(fetched || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching ticket categories from API:', err);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Handle selecting a Request Type
  const handleSelectRequestType = (category: TicketCategory, reqType: RequestType) => {
    setSelectedCategory(category);
    setSelectedRequestType(reqType);
    setGeneralComment('');
    setFieldErrors({});

    // Pre-populate default values from custom_fields
    const initialVals: Record<number, any> = {};
    if (reqType.custom_fields && reqType.custom_fields.length > 0) {
      reqType.custom_fields.forEach((field) => {
        const cleaned = cleanDefaultValue(field.default_value);
        if (cleaned) {
          initialVals[field.id] = cleaned;
        }
      });
    }
    setDynamicValues(initialVals);
    setStep('form');
  };

  // Change single field value
  const handleChangeField = (fieldId: number, value: any) => {
    setDynamicValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  // Date Modal handlers
  const handleOpenDatePicker = (fieldId: number, isRange = false) => {
    setActiveDateFieldId(fieldId);
    setIsSelectingRange(isRange);
    setRangeStartDate(null);
    setShowDatePickerModal(true);
  };

  const juneDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleSelectCalendarDay = (day: number) => {
    if (!activeDateFieldId) return;

    const formatted = `06/${day < 10 ? '0' + day : day}/2026`;

    if (isSelectingRange) {
      if (!rangeStartDate) {
        setRangeStartDate(formatted);
      } else {
        const rangeStr = `${rangeStartDate},${formatted}`;
        handleChangeField(activeDateFieldId, rangeStr);
        setShowDatePickerModal(false);
        setRangeStartDate(null);
      }
    } else {
      handleChangeField(activeDateFieldId, formatted);
      setShowDatePickerModal(false);
    }
  };

  // File Attachment Modal handlers
  const handleOpenAttachmentPicker = (fieldId: number) => {
    setActiveFileFieldId(fieldId);
    setShowAttachmentModal(true);
  };

  const handleSelectMockFile = (file: Attachment) => {
    if (!activeFileFieldId) return;
    const currentList = attachmentsByField[activeFileFieldId] || [];
    if (!currentList.some((item) => item.id === file.id)) {
      const updated = [...currentList, file];
      setAttachmentsByField((prev) => ({
        ...prev,
        [activeFileFieldId]: updated,
      }));
      handleChangeField(activeFileFieldId, file.name);
    }
    setShowAttachmentModal(false);
  };

  const handleRemoveAttachment = (fieldId: number, attachmentId: string) => {
    const currentList = attachmentsByField[fieldId] || [];
    const updated = currentList.filter((item) => item.id !== attachmentId);
    setAttachmentsByField((prev) => ({
      ...prev,
      [fieldId]: updated,
    }));
    if (updated.length === 0) {
      handleChangeField(fieldId, '');
    } else {
      handleChangeField(fieldId, updated.map((f) => f.name).join(', '));
    }
  };

  // Form Validation
  const validateDynamicForm = (): boolean => {
    if (!selectedRequestType) return false;
    const errors: Record<number, string> = {};
    const fields = selectedRequestType.custom_fields || [];

    fields.forEach((field) => {
      const val = dynamicValues[field.id];

      // Required check
      if (field.is_required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          errors[field.id] = `${field.label} is required`;
          return;
        }
      }

      // Number validations
      if (field.type === 'number' && val !== undefined && val !== null && String(val).trim() !== '') {
        const num = Number(val);
        if (isNaN(num)) {
          errors[field.id] = `${field.label} must be a valid number`;
        } else {
          const optionsObj = parseCustomFieldOptions(field.options);
          if (optionsObj) {
            if (optionsObj.min !== undefined && num < optionsObj.min) {
              errors[field.id] = `Minimum value is ${optionsObj.min}`;
            }
            if (optionsObj.max !== undefined && num > optionsObj.max) {
              errors[field.id] = `Maximum value is ${optionsObj.max}`;
            }
          }
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit
  const handleSubmit = async () => {
    if (!validateDynamicForm() || !selectedRequestType) return;

    setIsSubmitting(true);
    try {
      const customFieldsPayload = Object.entries(dynamicValues).map(([idStr, value]) => ({
        custom_field_id: Number(idStr),
        value: String(value),
      }));

      if (accessToken) {
        await createTicket(accessToken, {
          request_type_id: selectedRequestType.id,
          comment: generalComment,
          priority: selectedRequestType.priority || 'medium',
          custom_fields: customFieldsPayload,
        });
      }
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    } finally {
      setIsSubmitting(false);
      router.replace('/(tabs)/tickets?ticketCreated=true');
    }
  };

  const renderSelectStep = () => {
    return (
      <View style={styles.stepContainer}>
        <ScreenHeader title="New Request" onBackPress={() => router.back()} />
        <View style={styles.selectHeader}>
          <ThemedText style={styles.selectHeaderText}>
            Select a request type to get started
          </ThemedText>
        </View>

        {isLoadingCategories ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1EBD60" />
            <ThemedText style={styles.loadingText}>Loading request categories...</ThemedText>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyCategoriesContainer}>
            <SymbolView name="exclamationmark.triangle" size={32} tintColor="#8E8E93" />
            <ThemedText style={styles.emptyCategoriesTitle}>No Request Categories Found</ThemedText>
            <ThemedText style={styles.emptyCategoriesSubtitle}>
              Unable to load request categories from the API. Please try again.
            </ThemedText>
            <Pressable style={styles.retryBtn} onPress={loadCategories}>
              <ThemedText style={styles.retryBtnText}>Retry</ThemedText>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.categoriesScrollContent,
              { paddingBottom: insets.bottom + Spacing.six },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((category) => {
              const requestTypes = category.request_types || [];
              if (requestTypes.length === 0) return null;

              return (
                <View key={category.id} style={styles.categorySection}>
                  <ThemedText style={styles.categorySectionHeader}>
                    {category.name.toUpperCase()}
                  </ThemedText>

                  <View style={styles.optionsCard}>
                    {requestTypes.map((reqType, index) => {
                      const iconConfig = getIconForCategoryOrRequest(
                        category.name,
                        reqType.name,
                        category.icon
                      );

                      return (
                        <React.Fragment key={reqType.id}>
                          <Pressable
                            style={styles.optionRow}
                            onPress={() => handleSelectRequestType(category, reqType)}
                          >
                            <View
                              style={[
                                styles.optionIconWrapper,
                                { backgroundColor: iconConfig.bg },
                              ]}
                            >
                              <SymbolView
                                name={iconConfig.name}
                                size={20}
                                tintColor={iconConfig.tint}
                              />
                            </View>
                            <View style={styles.optionTextWrapper}>
                              <ThemedText style={styles.optionTitle}>{reqType.name}</ThemedText>
                              <ThemedText style={styles.optionDesc}>
                                {reqType.description || category.description || 'Submit request'}
                              </ThemedText>
                            </View>
                            <SymbolView name="chevron.right" size={16} tintColor="#8E8E93" />
                          </Pressable>

                          {index < requestTypes.length - 1 && (
                            <View style={styles.optionDivider} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderFormStep = () => {
    if (!selectedRequestType) return null;

    const fields = selectedRequestType.custom_fields || [];

    return (
      <View style={styles.stepContainer}>
        <ScreenHeader
          title={selectedRequestType.name}
          onBackPress={() => setStep('select')}
        />

        <ScrollView
          contentContainerStyle={[
            styles.formScrollContent,
            { paddingBottom: insets.bottom + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Metadata Banner */}
          <View style={styles.metaBanner}>
            <View style={styles.metaBadge}>
              <SymbolView name="clock" size={14} tintColor="#007AFF" />
              <ThemedText style={styles.metaBadgeText}>
                SLA: {selectedRequestType.sla ? `${selectedRequestType.sla} days` : 'Standard'}
              </ThemedText>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: '#FFF3E0' }]}>
              <SymbolView name="exclamationmark.circle" size={14} tintColor="#FF9500" />
              <ThemedText style={[styles.metaBadgeText, { color: '#FF9500' }]}>
                Priority: {(selectedRequestType.priority || 'Medium').toUpperCase()}
              </ThemedText>
            </View>
          </View>

          {/* Form Content Card */}
          <View style={styles.formCard}>
            {/* Dynamic Custom Fields */}
            <DynamicFormFields
              fields={fields}
              values={dynamicValues}
              errors={fieldErrors}
              onChangeField={handleChangeField}
              onOpenDatePicker={handleOpenDatePicker}
              onOpenAttachmentPicker={handleOpenAttachmentPicker}
              attachmentsByField={attachmentsByField}
              onRemoveAttachment={handleRemoveAttachment}
            />

            {/* General Comment / Notes */}
            <View style={styles.commentSection}>
              <ThemedText style={styles.inputLabel}>REASON / COMMENTS (OPTIONAL)</ThemedText>
              <TextInput
                style={styles.textArea}
                placeholder="Add any additional notes about your request..."
                placeholderTextColor="#9E9E9E"
                multiline
                numberOfLines={4}
                value={generalComment}
                onChangeText={setGeneralComment}
              />
            </View>

            {/* Submit Action */}
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

            {/* Notice */}
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
              <ThemedText style={styles.modalTitle}>
                {isSelectingRange
                  ? rangeStartDate
                    ? 'Select End Date'
                    : 'Select Start Date'
                  : 'Select Date'}
              </ThemedText>
              <Pressable onPress={() => setShowDatePickerModal(false)}>
                <SymbolView name="xmark" size={20} tintColor="#000000" />
              </Pressable>
            </View>

            <ThemedText style={styles.calendarSubheader}>June 2026</ThemedText>

            <View style={styles.calendarGrid}>
              {juneDays.map((day) => {
                const dateStr = `06/${day < 10 ? '0' + day : day}/2026`;
                const isSelected = activeDateFieldId
                  ? dynamicValues[activeDateFieldId] === dateStr || rangeStartDate === dateStr
                  : false;

                return (
                  <Pressable
                    key={day}
                    style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
                    onPress={() => handleSelectCalendarDay(day)}
                  >
                    <ThemedText
                      style={[
                        styles.calendarDayText,
                        isSelected && { color: '#ffffff', fontWeight: '700' },
                      ]}
                    >
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
  stepContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  loadingText: {
    fontSize: 14,
    color: '#60646C',
  },
  selectHeader: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  selectHeaderText: {
    fontSize: 16,
    color: '#60646C',
    fontWeight: '600',
  },
  categoriesScrollContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  categorySection: {
    gap: Spacing.two,
  },
  categorySectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginLeft: Spacing.one,
  },
  optionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
  },
  formScrollContent: {
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  metaBanner: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 12,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  formCard: {
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
  commentSection: {
    marginTop: Spacing.four,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60646C',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  btnSubmit: {
    backgroundColor: '#1EBD60',
    borderRadius: Spacing.two,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.five,
  },
  btnSubmitDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    color: '#ffffff',
    fontSize: 16,
  },
  formNoticeText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: Spacing.three,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  calendarSubheader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  calendarDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDaySelected: {
    backgroundColor: '#1EBD60',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1F2937',
  },
  modalList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    backgroundColor: '#F9FAFB',
    borderRadius: Spacing.two,
  },
  modalListDetails: {
    flex: 1,
  },
  emptyCategoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.six,
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyCategoriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: Spacing.two,
    textAlign: 'center',
  },
  emptyCategoriesSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  retryBtn: {
    backgroundColor: '#1EBD60',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

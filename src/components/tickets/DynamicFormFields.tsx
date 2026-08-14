import { SymbolView } from 'expo-symbols';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CustomField } from '@/services/ticketService';

/**
 * Safely parses options JSON string from backend CustomField.
 */
export function parseCustomFieldOptions(optionsStr?: string | null): any {
  if (!optionsStr || optionsStr.trim() === '') return null;
  try {
    return JSON.parse(optionsStr);
  } catch {
    return null;
  }
}

/**
 * Extracts selection choices array from CustomField options string.
 * Handles both ["Fisico", "Digital"] and {"data": ["Uno", "Dos", "Tres"]}.
 */
export function getFieldChoices(optionsStr?: string | null): string[] {
  const parsed = parseCustomFieldOptions(optionsStr);
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === 'object' && Array.isArray(parsed.data)) {
    return parsed.data;
  }
  return [];
}

/**
 * Cleans stringified default values like `"\"Option 1\""` or `"Digital"`.
 */
export function cleanDefaultValue(val?: string | null): string {
  if (!val) return '';
  let str = val.trim();
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'string' ? parsed : String(parsed);
    } catch {
      return str.slice(1, -1);
    }
  }
  return str;
}

export interface DynamicFormFieldsProps {
  fields: CustomField[];
  values: Record<number, any>;
  errors: Record<number, string>;
  onChangeField: (fieldId: number, value: any) => void;
  onOpenDatePicker?: (fieldId: number, isRange?: boolean) => void;
  onOpenAttachmentPicker?: (fieldId: number) => void;
  attachmentsByField?: Record<number, Array<{ id: string; name: string; size: string }>>;
  onRemoveAttachment?: (fieldId: number, attachmentId: string) => void;
}

export function DynamicFormFields({
  fields,
  values,
  errors,
  onChangeField,
  onOpenDatePicker,
  onOpenAttachmentPicker,
  attachmentsByField = {},
  onRemoveAttachment,
}: DynamicFormFieldsProps) {
  if (!fields || fields.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No additional fields required for this request type.
        </ThemedText>
      </View>
    );
  }

  // Sort fields by display_order ascending
  const sortedFields = [...fields].sort(
    (a, b) => (a.display_order ?? 1) - (b.display_order ?? 1)
  );

  const renderFieldInput = (field: CustomField) => {
    const value = values[field.id];
    const error = errors[field.id];
    const optionsObj = parseCustomFieldOptions(field.options);
    const choices = getFieldChoices(field.options);

    switch (field.type) {
      case 'string': {
        const maxLength = optionsObj?.maxLength;
        return (
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.textInput, error && styles.inputErrorBorder]}
              placeholder={field.placeholder || `Enter ${field.label}`}
              placeholderTextColor="#9E9E9E"
              maxLength={maxLength}
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChangeField(field.id, text)}
            />
            {maxLength ? (
              <ThemedText style={styles.helperText}>Max length: {maxLength} characters</ThemedText>
            ) : null}
          </View>
        );
      }

      case 'text': {
        return (
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.textArea, error && styles.inputErrorBorder]}
              placeholder={field.placeholder || `Enter details for ${field.label}...`}
              placeholderTextColor="#9E9E9E"
              multiline
              numberOfLines={4}
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChangeField(field.id, text)}
            />
          </View>
        );
      }

      case 'number': {
        const min = optionsObj?.min;
        const max = optionsObj?.max;
        return (
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.textInput, error && styles.inputErrorBorder]}
              placeholder={field.placeholder || `Enter number`}
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChangeField(field.id, text)}
            />
            {min !== undefined || max !== undefined ? (
              <ThemedText style={styles.helperText}>
                {min !== undefined && max !== undefined
                  ? `Value between ${min} and ${max}`
                  : min !== undefined
                  ? `Min value: ${min}`
                  : `Max value: ${max}`}
              </ThemedText>
            ) : null}
          </View>
        );
      }

      case 'boolean': {
        const isChecked = value === true || value === 'true' || value === '1';
        return (
          <View style={styles.fieldBlock}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => onChangeField(field.id, !isChecked)}
            >
              <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                {isChecked && <SymbolView name="checkmark" size={14} tintColor="#ffffff" />}
              </View>
              <ThemedText style={styles.checkboxText}>
                {field.placeholder || field.label}
              </ThemedText>
            </Pressable>
          </View>
        );
      }

      case 'check':
      case 'select': {
        const selectedVal = value != null ? String(value) : '';
        return (
          <View style={styles.fieldBlock}>
            {choices.length > 0 ? (
              <View style={styles.pillsContainer}>
                {choices.map((choice) => {
                  const active = selectedVal === choice;
                  return (
                    <Pressable
                      key={choice}
                      style={[styles.pillOption, active && styles.pillOptionActive]}
                      onPress={() => onChangeField(field.id, choice)}
                    >
                      <SymbolView
                        name={active ? 'checkmark.circle.fill' : 'circle'}
                        size={16}
                        tintColor={active ? '#1EBD60' : '#8E8E93'}
                      />
                      <ThemedText style={[styles.pillText, active && styles.pillTextActive]}>
                        {choice}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <TextInput
                style={[styles.textInput, error && styles.inputErrorBorder]}
                placeholder={field.placeholder || `Select ${field.label}`}
                placeholderTextColor="#9E9E9E"
                value={selectedVal}
                onChangeText={(text) => onChangeField(field.id, text)}
              />
            )}
          </View>
        );
      }

      case 'date': {
        const displayDate = value ? String(value) : '';
        return (
          <View style={styles.fieldBlock}>
            <Pressable
              style={[styles.dateInputButton, error && styles.inputErrorBorder]}
              onPress={() => onOpenDatePicker && onOpenDatePicker(field.id, false)}
            >
              <ThemedText style={[styles.dateInputText, !displayDate && { color: '#9E9E9E' }]}>
                {displayDate || field.placeholder || 'Select Date'}
              </ThemedText>
              <SymbolView name="calendar" size={18} tintColor="#8E8E93" />
            </Pressable>
          </View>
        );
      }

      case 'date_range': {
        const displayRange = value ? String(value) : '';
        return (
          <View style={styles.fieldBlock}>
            <Pressable
              style={[styles.dateInputButton, error && styles.inputErrorBorder]}
              onPress={() => onOpenDatePicker && onOpenDatePicker(field.id, true)}
            >
              <ThemedText style={[styles.dateInputText, !displayRange && { color: '#9E9E9E' }]}>
                {displayRange || field.placeholder || 'Select Date Range'}
              </ThemedText>
              <SymbolView name="calendar" size={18} tintColor="#8E8E93" />
            </Pressable>
          </View>
        );
      }

      case 'file': {
        const fieldFiles = attachmentsByField[field.id] || [];
        const maxSize = optionsObj?.maxSize;
        return (
          <View style={styles.fieldBlock}>
            {fieldFiles.map((file) => (
              <View key={file.id} style={styles.attachmentItem}>
                <SymbolView name="doc.text" size={18} tintColor="#8E8E93" />
                <View style={styles.attachmentDetails}>
                  <ThemedText style={styles.attachmentName}>{file.name}</ThemedText>
                  <ThemedText style={styles.attachmentSize}>{file.size}</ThemedText>
                </View>
                <Pressable
                  style={styles.removeAttachmentBtn}
                  onPress={() => onRemoveAttachment && onRemoveAttachment(field.id, file.id)}
                >
                  <SymbolView name="xmark.circle.fill" size={18} tintColor="#FF3B30" />
                </Pressable>
              </View>
            ))}

            <Pressable
              style={[styles.uploadButton, error && styles.inputErrorBorder]}
              onPress={() => onOpenAttachmentPicker && onOpenAttachmentPicker(field.id)}
            >
              <SymbolView name="plus" size={14} tintColor="#1EBD60" />
              <ThemedText style={styles.uploadButtonText}>
                Upload Document {maxSize ? `(Max ${maxSize})` : ''}
              </ThemedText>
            </Pressable>
          </View>
        );
      }

      default: {
        return (
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.textInput, error && styles.inputErrorBorder]}
              placeholder={field.placeholder || `Enter ${field.label}`}
              placeholderTextColor="#9E9E9E"
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChangeField(field.id, text)}
            />
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {sortedFields.map((field) => {
        const error = errors[field.id];
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <ThemedText style={styles.inputLabel}>
              {field.label.toUpperCase()}
              {field.is_required ? <ThemedText style={styles.requiredAsterisk}> *</ThemedText> : null}
            </ThemedText>
            {renderFieldInput(field)}
            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  emptyContainer: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  fieldContainer: {
    marginTop: Spacing.two,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60646C',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  requiredAsterisk: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  fieldBlock: {
    width: '100%',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
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
  inputErrorBorder: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#1EBD60',
    borderColor: '#1EBD60',
  },
  checkboxText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  pillsContainer: {
    flexDirection: 'column',
    gap: Spacing.two,
  },
  pillOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  pillOptionActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1EBD60',
  },
  pillText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#1EBD60',
    fontWeight: '600',
  },
  dateInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  dateInputText: {
    fontSize: 15,
    color: '#111827',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#1EBD60',
    borderRadius: Spacing.two,
    paddingVertical: 12,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1EBD60',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#F3F4F6',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  attachmentDetails: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeAttachmentBtn: {
    padding: 4,
  },
});

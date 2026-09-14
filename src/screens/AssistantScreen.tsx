import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { professions, getProfessionById, findTopicNode } from '../data/professions';
import { colors } from '../theme/colors';
import { findAnswer } from '../utils/assistant';
import type { TabParamList } from '../navigation/types';
import type { ChatMessage, ChatSuggestion } from '../types';

type Props = BottomTabScreenProps<TabParamList, 'Assistant'>;

let messageCounter = 0;
const nextId = () => `m${Date.now()}_${messageCounter++}`;

export default function AssistantScreen({ route }: Props) {
  const initialProfessionId = route.params?.professionId;
  const [activeProfessionId, setActiveProfessionId] = useState<string | undefined>(
    initialProfessionId
  );
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToEnd = () => setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

  const openProfession = (professionId: string) => {
    setActiveProfessionId(professionId);
    const profession = getProfessionById(professionId);
    if (!profession) return;

    const newMessages: ChatMessage[] = [
      {
        id: nextId(),
        role: 'assistant',
        text: `أهلاً! أنا مساعدك في مهنة "${profession.name}" ${profession.icon}\nاسألني عن أي مشكلة عملية بتواجهك في المجال ده.`,
      },
    ];

    if (profession.topics && profession.topics.length > 0) {
      newMessages.push({
        id: nextId(),
        role: 'assistant',
        text: 'أو اختار موضوع تحب تتعرف عليه أكتر 👇',
        suggestions: profession.topics.map((t) => ({ id: t.id, label: t.label })),
      });
    }

    setMessages((prev) => [...prev, ...newMessages]);
    scrollToEnd();
  };

  useEffect(() => {
    if (initialProfessionId) {
      openProfession(initialProfessionId);
    } else if (messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          role: 'assistant',
          text: 'أهلاً بيك 👋 أنا المساعد التفاعلي. اختار مهنة من فوق أو ابعت سؤالك مباشرة عن أي مشكلة عملية.',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProfessionId]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = { id: nextId(), role: 'user', text };
    const result = findAnswer(text, activeProfessionId);

    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      text: result.answer,
      professionId: result.matchedProfessionId,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    scrollToEnd();
  };

  const selectSuggestion = (suggestion: ChatSuggestion) => {
    const profession = activeProfessionId ? getProfessionById(activeProfessionId) : undefined;
    if (!profession?.topics) return;
    const node = findTopicNode(profession.topics, suggestion.id);
    if (!node) return;

    const userMessage: ChatMessage = { id: nextId(), role: 'user', text: node.label };
    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      text: node.answer,
      image: node.image,
      suggestions: node.children?.map((c) => ({ id: c.id, label: c.label })),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    scrollToEnd();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>المساعد التفاعلي</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          style={[styles.chip, !activeProfessionId && styles.chipActive]}
          onPress={() => setActiveProfessionId(undefined)}
        >
          <Text style={[styles.chipText, !activeProfessionId && styles.chipTextActive]}>
            عام
          </Text>
        </TouchableOpacity>
        {professions.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.chip, activeProfessionId === p.id && styles.chipActive]}
            onPress={() => openProfession(p.id)}
          >
            <Text
              style={[styles.chipText, activeProfessionId === p.id && styles.chipTextActive]}
            >
              {p.icon} {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={item.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant}>
              <View
                style={[
                  styles.bubble,
                  item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                ]}
              >
                {!!item.image && (
                  <Image source={item.image} style={styles.bubbleImage} resizeMode="cover" />
                )}
                <Text
                  style={[
                    styles.bubbleText,
                    item.role === 'user' && { color: '#fff' },
                  ]}
                >
                  {item.text}
                </Text>
              </View>

              {!!item.suggestions?.length && (
                <View style={styles.suggestionsWrap}>
                  {item.suggestions.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={styles.suggestionChip}
                      onPress={() => selectSuggestion(s)}
                    >
                      <Text style={styles.suggestionChipText}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.sendButton} onPress={send}>
            <Text style={styles.sendButtonText}>إرسال</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="اكتب مشكلتك هنا..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            textAlign="right"
            multiline
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
  },
  chipsRow: { flexGrow: 0, marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageRowUser: { alignItems: 'flex-end', marginBottom: 10 },
  messageRowAssistant: { alignItems: 'flex-start', marginBottom: 10 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 12 },
  bubbleImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  bubbleUser: { backgroundColor: colors.bubbleUser },
  bubbleAssistant: { backgroundColor: colors.bubbleAssistant },
  bubbleText: { fontSize: 14, color: colors.text, textAlign: 'right', lineHeight: 21 },
  suggestionsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    maxWidth: '95%',
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  suggestionChipText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sendButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

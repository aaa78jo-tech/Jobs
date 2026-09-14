import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { professions } from '../data/professions';
import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme/colors';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const { favoriteIds, toggleFavorite, userName, setUserName, isLoaded } = useFavorites();
  const [nameDraft, setNameDraft] = useState(userName);

  const favoriteProfessions = professions.filter((p) => favoriteIds.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>الملف الشخصي</Text>

      <View style={styles.nameCard}>
        <Text style={styles.nameLabel}>الاسم</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="اكتب اسمك..."
          placeholderTextColor={colors.textMuted}
          value={nameDraft}
          onChangeText={setNameDraft}
          onBlur={() => setUserName(nameDraft.trim())}
          onSubmitEditing={() => setUserName(nameDraft.trim())}
          textAlign="right"
        />
      </View>

      <Text style={styles.sectionTitle}>
        المهن المفضلة {isLoaded ? `(${favoriteProfessions.length})` : ''}
      </Text>

      {isLoaded && favoriteProfessions.length === 0 && (
        <Text style={styles.emptyText}>
          لسه معملتش أي مهنة مفضلة. افتح أي مهنة واضغط على ⭐ عشان تضيفها هنا.
        </Text>
      )}

      <FlatList
        data={favoriteProfessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProfessionDetail', { professionId: item.id })}
          >
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.removeButtonText}>⭐</Text>
            </TouchableOpacity>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
            </View>
            <Text style={styles.cardIcon}>{item.icon}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  header: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: 12, marginBottom: 16 },
  nameCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  nameLabel: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginBottom: 6 },
  nameInput: { fontSize: 16, color: colors.text, textAlign: 'right', paddingVertical: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'right', marginBottom: 10 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'right', lineHeight: 22 },
  listContent: { paddingBottom: 24 },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: { fontSize: 28, marginRight: 4 },
  cardTextWrap: { flex: 1, marginHorizontal: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'right' },
  cardCategory: { fontSize: 12, color: colors.primary, textAlign: 'right', marginTop: 2 },
  removeButton: { padding: 4 },
  removeButtonText: { fontSize: 20 },
});

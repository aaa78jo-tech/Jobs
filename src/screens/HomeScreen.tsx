import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { professions } from '../data/professions';
import { colors } from '../theme/colors';
import { useFavorites } from '../context/FavoritesContext';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import type { Profession } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    if (!query.trim()) return professions;
    const q = query.trim();
    return professions.filter(
      (p) => p.name.includes(q) || p.category.includes(q) || p.shortDescription.includes(q)
    );
  }, [query]);

  const featured = filtered.find((p) => p.isFeatured);
  const rest = filtered.filter((p) => !p.isFeatured);

  const renderCard = (item: Profession, big?: boolean) => (
    <TouchableOpacity
      style={[styles.card, big && styles.cardFeatured]}
      onPress={() => navigation.navigate('ProfessionDetail', { professionId: item.id })}
    >
      <Text style={styles.cardIcon}>{item.icon}</Text>
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.shortDescription}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.favoriteIcon}>{isFavorite(item.id) ? '⭐' : '☆'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>اكتشف المهن</Text>
      <Text style={styles.subHeader}>تعلم عن كل مهنة واسأل المساعد عن مشاكلها العملية</Text>

      <TextInput
        style={styles.search}
        placeholder="ابحث عن مهنة..."
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        textAlign="right"
      />

      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={featured ? <View>{renderCard(featured, true)}</View> : null}
        renderItem={({ item }) => renderCard(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  header: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: 12 },
  subHeader: { fontSize: 14, color: colors.textMuted, textAlign: 'right', marginTop: 4, marginBottom: 16 },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
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
  cardFeatured: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#EAF3EC',
  },
  cardIcon: { fontSize: 34, marginLeft: 14 },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'right' },
  cardCategory: { fontSize: 12, color: colors.primary, textAlign: 'right', marginTop: 2 },
  cardDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 4 },
  favoriteIcon: { fontSize: 22, marginRight: 8, color: colors.accent },
});

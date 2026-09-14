import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getProfessionById } from '../data/professions';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfessionDetail'>;

export default function ProfessionDetailScreen({ route, navigation }: Props) {
  const profession = getProfessionById(route.params.professionId);

  if (!profession) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>المهنة غير موجودة</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.icon}>{profession.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{profession.name}</Text>
            <Text style={styles.category}>{profession.category}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>نبذة عن المهنة</Text>
        <Text style={styles.paragraph}>{profession.overview}</Text>

        <Text style={styles.sectionTitle}>المهارات المطلوبة</Text>
        {profession.requiredSkills.map((skill, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{skill}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>مهام يومية شائعة</Text>
        {profession.dailyTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.assistantButton}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'Assistant',
              params: { professionId: profession.id },
            } as never)
          }
        >
          <Text style={styles.assistantButtonText}>
            اسأل المساعد عن مشاكل {profession.name} 💬
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  notFound: { textAlign: 'center', marginTop: 40, color: colors.text },
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 48, marginLeft: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'right' },
  category: { fontSize: 14, color: colors.primary, textAlign: 'right', marginTop: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: { fontSize: 15, color: colors.text, textAlign: 'right', lineHeight: 24 },
  bulletRow: { flexDirection: 'row-reverse', marginBottom: 6 },
  bulletDot: { color: colors.primary, fontSize: 16, marginLeft: 8 },
  bulletText: { fontSize: 14, color: colors.text, textAlign: 'right', flex: 1 },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskTitle: { fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'right' },
  taskDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 4 },
  assistantButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  assistantButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

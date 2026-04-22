// frontend/src/app/components/ReportPDF.tsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Transaction } from './Dashboard'; // Импортируем ваш тип транзакций

// --- Регистрация шрифта для корректного отображения кириллицы ---
// ВАЖНО: Скачайте файл шрифта (например, 'fonts/NotoSans-Regular.ttf') и положите в папку public или src.
// Проще всего скачать Noto Sans отсюда: https://fonts.google.com/noto/specimen/Noto+Sans
// или использовать любой другой TTF-шрифт с поддержкой кириллицы.
// Укажите правильный путь до файла шрифта!
Font.register({
  family: 'NotoSans',
  src: '/fonts/NotoSans-Regular.ttf', // Убедитесь, что путь верный
});

// Определяем стили для PDF-документа
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'NotoSans', // Применяем зарегистрированный шрифт ко всему документу
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 14,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  summaryContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableColDate: { width: '15%', padding: 5 },
  tableColCategory: { width: '20%', padding: 5 },
  tableColAmount: { width: '20%', padding: 5, textAlign: 'right' },
  tableColType: { width: '15%', padding: 5 },
  tableColComment: { width: '30%', padding: 5 },
});

interface ReportPDFProps {
  transactions: Transaction[];
  monthName: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: [string, number][];
}

export const ReportPDF = ({
  transactions,
  monthName,
  year,
  totalIncome,
  totalExpenses,
  balance,
  expensesByCategory,
}: ReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Заголовок */}
      <Text style={styles.title}>Финансовый отчет</Text>
      <Text style={styles.subtitle}>
        {monthName} {year}
      </Text>

      {/* Сводка */}
      <Text style={styles.sectionTitle}>Сводка</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Доходы</Text>
          <Text style={[styles.summaryValue, { color: 'green' }]}>
            +{totalIncome.toLocaleString()} ₽
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Расходы</Text>
          <Text style={[styles.summaryValue, { color: 'red' }]}>
            -{totalExpenses.toLocaleString()} ₽
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Баланс</Text>
          <Text style={[styles.summaryValue, { color: balance >= 0 ? 'green' : 'red' }]}>
            {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ₽
          </Text>
        </View>
      </View>

      {/* Расходы по категориям */}
      <Text style={styles.sectionTitle}>Расходы по категориям</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColCategory}><Text>Категория</Text></View>
          <View style={styles.tableColAmount}><Text>Сумма</Text></View>
        </View>
        {expensesByCategory.map(([category, amount]) => (
          <View style={styles.tableRow} key={category}>
            <View style={styles.tableColCategory}><Text>{category}</Text></View>
            <View style={styles.tableColAmount}><Text>{amount.toLocaleString()} ₽</Text></View>
          </View>
        ))}
      </View>

      {/* Детали транзакций */}
      <Text style={styles.sectionTitle}>Детали транзакций</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColDate}><Text>Дата</Text></View>
          <View style={styles.tableColCategory}><Text>Категория</Text></View>
          <View style={styles.tableColAmount}><Text>Сумма</Text></View>
          <View style={styles.tableColType}><Text>Тип</Text></View>
          <View style={styles.tableColComment}><Text>Комментарий</Text></View>
        </View>
        {transactions.map((t) => (
          <View style={styles.tableRow} key={t.id}>
            <View style={styles.tableColDate}><Text>{t.date}</Text></View>
            <View style={styles.tableColCategory}><Text>{t.category}</Text></View>
            <View style={styles.tableColAmount}>
              <Text>{(t.type === 'income' ? '+' : '-')}{t.amount.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.tableColType}><Text>{t.type === 'income' ? 'Доход' : 'Расход'}</Text></View>
            <View style={styles.tableColComment}><Text>{t.comment || '—'}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
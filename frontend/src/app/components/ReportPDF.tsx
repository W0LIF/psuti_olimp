// frontend/src/app/components/ReportPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Интерфейс должен совпадать с тем, что передаётся из ReportsPage
interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  comment?: string;
  category: string;
}

// Регистрация шрифта с поддержкой кириллицы (файл должен лежать в public/fonts/)
Font.register({
  family: 'NotoSans',
  src: '/fonts/NotoSans-Regular.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: 'NotoSans', fontSize: 10 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 12, textAlign: 'center', marginBottom: 30, color: '#666' },
  sectionTitle: { fontSize: 14, marginVertical: 10, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '30%', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5, textAlign: 'center' },
  summaryLabel: { fontSize: 10, marginBottom: 5 },
  summaryValue: { fontSize: 14, fontWeight: 'bold' },
  table: { width: 'auto', marginTop: 10, marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', alignItems: 'center' },
  tableHeader: { backgroundColor: '#f3f4f6', fontWeight: 'bold' },
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

export const ReportPDF = (props: ReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Финансовый отчёт</Text>
      <Text style={styles.subtitle}>{props.monthName} {props.year}</Text>

      <Text style={styles.sectionTitle}>Сводка</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Доходы</Text>
          <Text style={[styles.summaryValue, { color: 'green' }]}>+{props.totalIncome.toLocaleString()} ₽</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Расходы</Text>
          <Text style={[styles.summaryValue, { color: 'red' }]}>-{props.totalExpenses.toLocaleString()} ₽</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Баланс</Text>
          <Text style={[styles.summaryValue, { color: props.balance >= 0 ? 'green' : 'red' }]}>
            {props.balance >= 0 ? '+' : ''}{props.balance.toLocaleString()} ₽
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Расходы по категориям</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColCategory}><Text>Категория</Text></View>
          <View style={styles.tableColAmount}><Text>Сумма</Text></View>
        </View>
        {props.expensesByCategory.map(([cat, amt]) => (
          <View style={styles.tableRow} key={cat}>
            <View style={styles.tableColCategory}><Text>{cat}</Text></View>
            <View style={styles.tableColAmount}><Text>{amt.toLocaleString()} ₽</Text></View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Детали транзакций</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColDate}><Text>Дата</Text></View>
          <View style={styles.tableColCategory}><Text>Категория</Text></View>
          <View style={styles.tableColAmount}><Text>Сумма</Text></View>
          <View style={styles.tableColType}><Text>Тип</Text></View>
          <View style={styles.tableColComment}><Text>Комментарий</Text></View>
        </View>
        {props.transactions.map(t => (
          <View style={styles.tableRow} key={t.id}>
            <View style={styles.tableColDate}><Text>{t.date}</Text></View>
            <View style={styles.tableColCategory}><Text>{t.category}</Text></View>
            <View style={styles.tableColAmount}>
              <Text>{t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.tableColType}><Text>{t.type === 'income' ? 'Доход' : 'Расход'}</Text></View>
            <View style={styles.tableColComment}><Text>{t.comment || '—'}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
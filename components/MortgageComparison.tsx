import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MortgageCalculator from './MortgageCalculator';

interface MortgageComparisonProps {
  primaryColor: string;
}

interface CalculationResult {
  monthlyPayment: number;
  totalLoan: number;
  downPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  homeownersInsurance: number;
  ltvRatio: number;
}

export default function MortgageComparison({ primaryColor }: MortgageComparisonProps) {
  const [calculations, setCalculations] = useState<{[key: string]: CalculationResult}>({});

  const handleCalculationChange = (calculatorId: string, calculation: CalculationResult) => {
    setCalculations(prev => ({
      ...prev,
      [calculatorId]: calculation
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mortgage Calculator Comparison</Text>
      <Text style={styles.subtitle}>Compare up to 3 different home prices side by side</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.calculatorsContainer}
      >
        <View style={styles.calculatorWrapper}>
          <MortgageCalculator
            title="Option 1"
            primaryColor={primaryColor}
            onCalculationChange={(calc) => handleCalculationChange('calc1', calc)}
          />
        </View>
        
        <View style={styles.calculatorWrapper}>
          <MortgageCalculator
            title="Option 2"
            primaryColor={primaryColor}
            onCalculationChange={(calc) => handleCalculationChange('calc2', calc)}
          />
        </View>
        
        <View style={styles.calculatorWrapper}>
          <MortgageCalculator
            title="Option 3"
            primaryColor={primaryColor}
            onCalculationChange={(calc) => handleCalculationChange('calc3', calc)}
          />
        </View>
      </ScrollView>

      {Object.keys(calculations).length > 1 && (
        <View style={styles.comparisonSummary}>
          <Text style={styles.comparisonTitle}>Quick Comparison</Text>
          <View style={styles.comparisonTable}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonHeaderText}>Option</Text>
              <Text style={styles.comparisonHeaderText}>Monthly Payment</Text>
              <Text style={styles.comparisonHeaderText}>LTV</Text>
            </View>
            
            {Object.entries(calculations).map(([key, calc], index) => (
              <View key={key} style={styles.comparisonRow}>
                <Text style={styles.comparisonCell}>Option {index + 1}</Text>
                <Text style={styles.comparisonCell}>
                  ${Math.round(calc.monthlyPayment).toLocaleString()}
                </Text>
                <Text style={styles.comparisonCell}>
                  {calc.ltvRatio.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  calculatorsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  calculatorWrapper: {
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonSummary: {
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  comparisonTable: {
    gap: 8,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  comparisonCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});
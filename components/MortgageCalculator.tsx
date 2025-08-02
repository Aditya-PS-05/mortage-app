import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface MortgageCalculatorProps {
  title?: string;
  primaryColor: string;
  onCalculationChange?: (calculation: CalculationResult) => void;
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

export default function MortgageCalculator({ title, primaryColor, onCalculationChange }: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState('425000');
  const [downPaymentAmount, setDownPaymentAmount] = useState('85000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('6.750');
  const [zipCode, setZipCode] = useState('85339');

  const calculateMortgage = (): CalculationResult => {
    const price = parseFloat(homePrice) || 0;
    const downAmt = parseFloat(downPaymentAmount) || 0;
    const loanAmount = price - downAmt;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12;
    const payments = (parseFloat(loanTerm) || 0) * 12;
    
    let monthlyPI = 0;
    if (rate > 0 && payments > 0) {
      monthlyPI = loanAmount * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    }
    
    const propertyTax = price * 0.012 / 12; // 1.2% annually
    const insurance = price * 0.004 / 12; // 0.4% annually
    const totalMonthly = monthlyPI + propertyTax + insurance;
    const ltv = (loanAmount / price) * 100;

    return {
      monthlyPayment: totalMonthly,
      totalLoan: loanAmount,
      downPayment: downAmt,
      principalAndInterest: monthlyPI,
      propertyTax,
      homeownersInsurance: insurance,
      ltvRatio: ltv
    };
  };

  useEffect(() => {
    const calculation = calculateMortgage();
    onCalculationChange?.(calculation);
  }, [homePrice, downPaymentAmount, loanTerm, interestRate]);

  useEffect(() => {
    const price = parseFloat(homePrice) || 0;
    const percent = parseFloat(downPaymentPercent) || 0;
    const newDownPayment = (price * percent / 100).toString();
    if (newDownPayment !== downPaymentAmount) {
      setDownPaymentAmount(newDownPayment);
    }
  }, [homePrice, downPaymentPercent]);

  useEffect(() => {
    const price = parseFloat(homePrice) || 0;
    const amount = parseFloat(downPaymentAmount) || 0;
    const newPercent = price > 0 ? ((amount / price) * 100).toFixed(0) : '0';
    if (newPercent !== downPaymentPercent) {
      setDownPaymentPercent(newPercent);
    }
  }, [homePrice, downPaymentAmount]);

  const calculation = calculateMortgage();

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Home price</Text>
          <TextInput
            style={[styles.input, { borderColor: primaryColor }]}
            value={homePrice}
            onChangeText={setHomePrice}
            keyboardType="numeric"
            placeholder="425,000"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Down payment</Text>
          <View style={styles.downPaymentContainer}>
            <TextInput
              style={[styles.input, styles.downPaymentInput, { borderColor: primaryColor }]}
              value={downPaymentAmount}
              onChangeText={setDownPaymentAmount}
              keyboardType="numeric"
              placeholder="85,000"
            />
            <TextInput
              style={[styles.input, styles.percentInput, { borderColor: primaryColor }]}
              value={downPaymentPercent}
              onChangeText={setDownPaymentPercent}
              keyboardType="numeric"
              placeholder="20"
            />
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loan term</Text>
          <TextInput
            style={[styles.input, { borderColor: primaryColor }]}
            value={loanTerm}
            onChangeText={setLoanTerm}
            keyboardType="numeric"
            placeholder="30 years"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interest rate</Text>
          <View style={styles.rateContainer}>
            <TextInput
              style={[styles.input, styles.rateInput, { borderColor: primaryColor }]}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              placeholder="6.750"
            />
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ZIP code</Text>
          <TextInput
            style={[styles.input, { borderColor: primaryColor }]}
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            placeholder="85339"
          />
        </View>
      </View>

      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>Monthly payment breakdown</Text>
        <View style={styles.paymentCircle}>
          <Text style={[styles.paymentAmount, { color: primaryColor }]}>
            ${Math.round(calculation.monthlyPayment).toLocaleString()}
          </Text>
          <Text style={styles.paymentLabel}>/mo</Text>
        </View>
        
        <View style={styles.breakdownList}>
          <View style={styles.breakdownItem}>
            <View style={[styles.colorDot, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.breakdownLabel}>Principal & Interest</Text>
            <Text style={styles.breakdownAmount}>
              ${Math.round(calculation.principalAndInterest).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={[styles.colorDot, { backgroundColor: '#50E3C2' }]} />
            <Text style={styles.breakdownLabel}>Property tax</Text>
            <Text style={styles.breakdownAmount}>
              ${Math.round(calculation.propertyTax).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={[styles.colorDot, { backgroundColor: '#9013FE' }]} />
            <Text style={styles.breakdownLabel}>Homeowner&apos;s insurance</Text>
            <Text style={styles.breakdownAmount}>
              ${Math.round(calculation.homeownersInsurance).toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={styles.ltvText}>
          LTV: {calculation.ltvRatio.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  downPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downPaymentInput: {
    flex: 2,
  },
  percentInput: {
    flex: 1,
  },
  percentSymbol: {
    fontSize: 16,
    color: '#666',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateInput: {
    flex: 1,
  },
  resultSection: {
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  paymentCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownList: {
    width: '100%',
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ltvText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});
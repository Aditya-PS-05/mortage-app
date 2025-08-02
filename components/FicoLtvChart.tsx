import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FicoLtvChartProps {
  loanType: 'purchase' | 'refinance' | 'cashout';
  primaryColor: string;
}

export default function FicoLtvChart({ loanType, primaryColor }: FicoLtvChartProps) {
  const getLtvByFico = (fico: number): number => {
    switch (loanType) {
      case 'purchase':
        if (fico >= 700) return 90;
        if (fico >= 650) return 87;
        if (fico >= 600) return 85;
        return 80;
      
      case 'refinance':
        if (fico >= 700) return 88;
        if (fico >= 650) return 83;
        if (fico >= 600) return 77;
        return 75;
      
      case 'cashout':
        if (fico >= 700) return 82;
        if (fico >= 650) return 80;
        if (fico >= 600) return 77;
        return 75;
      
      default:
        return 80;
    }
  };

  const ficoScores = [580, 600, 650, 700];
  const chartHeight = 200;
  const chartWidth = 280;

  const getYPosition = (ltv: number): number => {
    const minLtv = 70;
    const maxLtv = 95;
    return chartHeight - ((ltv - minLtv) / (maxLtv - minLtv)) * chartHeight;
  };

  const getXPosition = (fico: number): number => {
    const minFico = 560;
    const maxFico = 720;
    return ((fico - minFico) / (maxFico - minFico)) * chartWidth;
  };

  const points = ficoScores.map(fico => ({
    x: getXPosition(fico),
    y: getYPosition(getLtvByFico(fico)),
    fico,
    ltv: getLtvByFico(fico)
  }));


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: primaryColor }]}>
        FICO vs LTV Ratio - {loanType.charAt(0).toUpperCase() + loanType.slice(1)}
      </Text>
      
      <View style={[styles.chartContainer, { height: chartHeight + 60, width: chartWidth + 60 }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {[95, 90, 85, 80, 75].map(ltv => (
            <Text key={ltv} style={styles.axisLabel}>
              {ltv}%
            </Text>
          ))}
        </View>
        
        {/* Chart area */}
        <View style={[styles.chartArea, { height: chartHeight, width: chartWidth }]}>
          {/* Grid lines */}
          {[75, 80, 85, 90, 95].map(ltv => (
            <View
              key={`grid-${ltv}`}
              style={[
                styles.gridLine,
                { 
                  top: getYPosition(ltv),
                  width: chartWidth
                }
              ]}
            />
          ))}
          
          {/* Data points */}
          {points.map((point, index) => (
            <View key={index}>
              <View
                style={[
                  styles.dataPoint,
                  {
                    left: point.x - 6,
                    top: point.y - 6,
                    backgroundColor: primaryColor
                  }
                ]}
              />
              <Text
                style={[
                  styles.dataLabel,
                  {
                    left: point.x - 20,
                    top: point.y - 30,
                  }
                ]}
              >
                {point.ltv}%
              </Text>
            </View>
          ))}
          
          {/* Connect the dots with lines */}
          {points.slice(1).map((point, index) => {
            const prevPoint = points[index];
            const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            const length = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
            );
            
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.connectingLine,
                  {
                    left: prevPoint.x,
                    top: prevPoint.y,
                    width: length,
                    transform: [{ rotate: `${angle}rad` }],
                    backgroundColor: primaryColor
                  }
                ]}
              />
            );
          })}
        </View>
        
        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {ficoScores.map(fico => (
            <Text
              key={fico}
              style={[
                styles.axisLabel,
                { 
                  position: 'absolute',
                  left: getXPosition(fico) - 15,
                  top: 10
                }
              ]}
            >
              {fico}
            </Text>
          ))}
        </View>
        
        <Text style={styles.xAxisTitle}>FICO Score</Text>
      </View>
      
      <View style={styles.ltvTitle}>
        <Text style={styles.ltvText}>LTV</Text>
      </View>
      
      <Text style={styles.disclaimer}>
        Higher FICO scores generally qualify for higher LTV ratios. 
        DTI should remain under 50% for optimal approval chances.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 30,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  chartArea: {
    marginLeft: 40,
    marginTop: 30,
    position: 'relative',
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ddd',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dataLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    width: 40,
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    transformOrigin: '0 50%',
  },
  xAxisLabels: {
    position: 'relative',
    height: 30,
    width: 280,
    marginLeft: 40,
  },
  axisLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  xAxisTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  ltvTitle: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ rotate: '-90deg' }],
  },
  ltvText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
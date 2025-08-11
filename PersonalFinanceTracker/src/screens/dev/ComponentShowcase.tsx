import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Card, Pill, Button, Input } from '../../ui/atoms';
import { useTheme, useThemeContext } from '../../hooks/useTheme';

export const ComponentShowcase: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');
  
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View style={[styles.section, { marginBottom: theme.spacing[6] }]}>
      <Text style={[theme.typography.h5, { color: theme.colors.text.primary, marginBottom: theme.spacing[4] }]}>
        {title}
      </Text>
      {children}
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { padding: theme.spacing[4] }]}>
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary }]}>
            Component Showcase
          </Text>
          <View style={styles.themeToggle}>
            <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>
              Theme: {themeMode}
            </Text>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.stone[300], true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>
        
        <View style={{ padding: theme.spacing[4] }}>
          <Section title="Cards">
            <Card margin={2}>
              <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>Default Card</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: theme.spacing[2] }]}>
                This is a default card with some content inside.
              </Text>
            </Card>
            
            <Card variant="outlined" margin={2}>
              <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>Outlined Card</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: theme.spacing[2] }]}>
                This card has an outlined border style.
              </Text>
            </Card>
            
            <Card variant="elevated" margin={2}>
              <Text style={[theme.typography.h6, { color: theme.colors.text.primary }]}>Elevated Card</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: theme.spacing[2] }]}>
                This card has increased elevation for emphasis.
              </Text>
            </Card>
            
            <Card 
              margin={2}
              onPress={() => console.log('Card pressed')}
              backgroundColor={theme.colors.purple[50]}
            >
              <Text style={[theme.typography.h6, { color: theme.colors.primary }]}>Pressable Card</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: theme.spacing[2] }]}>
                This card is pressable with a custom background.
              </Text>
            </Card>
          </Section>
          
          <Section title="Pills">
            <View style={styles.row}>
              <Pill value="$12,450" color="primary" style={styles.pill} />
              <Pill value="Active" color="success" style={styles.pill} />
              <Pill value="Warning" color="warning" style={styles.pill} />
              <Pill value="Error" color="danger" style={styles.pill} />
            </View>
            
            <View style={styles.row}>
              <Pill label="Balance" value="$5,230" color="accent" style={styles.pill} />
              <Pill label="Accounts" value="4" color="primary" style={styles.pill} />
              <Pill label="Status" value="OK" color="success" style={styles.pill} />
            </View>
            
            <View style={styles.row}>
              <Pill value="Small" size="sm" style={styles.pill} />
              <Pill value="Medium" size="md" style={styles.pill} />
              <Pill value="Large" size="lg" style={styles.pill} />
            </View>
          </Section>
          
          <Section title="Buttons">
            <Button onPress={() => console.log('Primary')} style={styles.button}>
              Primary Button
            </Button>
            
            <Button variant="secondary" onPress={() => console.log('Secondary')} style={styles.button}>
              Secondary Button
            </Button>
            
            <Button variant="ghost" onPress={() => console.log('Ghost')} style={styles.button}>
              Ghost Button
            </Button>
            
            <Button variant="danger" onPress={() => console.log('Danger')} style={styles.button}>
              Danger Button
            </Button>
            
            <View style={styles.row}>
              <Button size="sm" onPress={() => {}} style={styles.buttonInRow}>
                Small
              </Button>
              <Button size="md" onPress={() => {}} style={styles.buttonInRow}>
                Medium
              </Button>
              <Button size="lg" onPress={() => {}} style={styles.buttonInRow}>
                Large
              </Button>
            </View>
            
            <Button fullWidth onPress={() => {}} style={styles.button}>
              Full Width Button
            </Button>
            
            <Button loading style={styles.button}>
              Loading...
            </Button>
            
            <Button disabled style={styles.button}>
              Disabled Button
            </Button>
          </Section>
          
          <Section title="Inputs">
            <Input
              label="Standard Input"
              placeholder="Enter text..."
              value={inputValue}
              onChangeText={setInputValue}
              helperText="This is helper text"
            />
            
            <Input
              label="Email Input"
              type="email"
              placeholder="email@example.com"
              value={emailValue}
              onChangeText={setEmailValue}
              clearable
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={passwordValue}
              onChangeText={setPasswordValue}
            />
            
            <Input
              label="Currency Input"
              type="currency"
              placeholder="0.00"
              value={currencyValue}
              onChangeText={setCurrencyValue}
              helperText="Enter amount"
            />
            
            <Input
              label="Input with Error"
              value="Invalid input"
              error="This field has an error"
              onChangeText={() => {}}
            />
            
            <Input
              label="Filled Variant"
              variant="filled"
              placeholder="Filled input style"
              value=""
              onChangeText={() => {}}
            />
            
            <Input
              label="Disabled Input"
              value="Cannot edit this"
              disabled
              onChangeText={() => {}}
            />
            
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Input
                  label="Small"
                  size="sm"
                  placeholder="Small input"
                  value=""
                  onChangeText={() => {}}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Input
                  label="Large"
                  size="lg"
                  placeholder="Large input"
                  value=""
                  onChangeText={() => {}}
                />
              </View>
            </View>
          </Section>
          
          <Section title="Color Palette">
            <View style={styles.colorGrid}>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.colorText}>Primary</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.accent }]}>
                <Text style={styles.colorText}>Accent</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.colorText}>Success</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.warning }]}>
                <Text style={styles.colorText}>Warning</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.danger }]}>
                <Text style={styles.colorText}>Danger</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.info }]}>
                <Text style={styles.colorText}>Info</Text>
              </View>
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  pill: {
    marginRight: 8,
    marginBottom: 8,
  },
  button: {
    marginBottom: 12,
  },
  buttonInRow: {
    marginRight: 8,
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorBox: {
    width: '30%',
    height: 80,
    margin: '1.5%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    color: '#fff',
    fontWeight: '600',
  },
});
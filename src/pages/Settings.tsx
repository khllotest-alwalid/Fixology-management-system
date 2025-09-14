import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import Layout from '@/components/layout/Layout';
import { Globe, Palette, Monitor, Sun, Moon } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  const themes = [
    { value: 'light', name: t('light'), icon: Sun },
    { value: 'dark', name: t('dark'), icon: Moon },
    { value: 'system', name: t('system'), icon: Monitor },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('settings')}</h1>
          <p className="text-muted-foreground">Customize your application preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <div>
                  <CardTitle>{t('language')}</CardTitle>
                  <CardDescription>Choose your preferred language</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select value={i18n.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                The application will automatically adapt to right-to-left (RTL) layout for Arabic language.
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <div>
                  <CardTitle>{t('theme')}</CardTitle>
                  <CardDescription>Choose your preferred theme</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('theme')}</Label>
                <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((themeOption) => {
                      const Icon = themeOption.icon;
                      return (
                        <SelectItem key={themeOption.value} value={themeOption.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{themeOption.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                System theme will automatically match your device's theme preference.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Info */}
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
            <CardDescription>About Fixology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Fixology - Mobile & Laptop Repair Management</h3>
              <p className="text-sm text-muted-foreground">
                A comprehensive solution for managing mobile phone and laptop repair shops.
                Track devices, manage payments, analyze statistics, and generate reports.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Features:</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                <li>Device reception and tracking</li>
                <li>Shop account management</li>
                <li>Payment recording and debt tracking</li>
                <li>Comprehensive statistics and analytics</li>
                <li>Multi-language support (English, Arabic, Turkish)</li>
                <li>Dark/Light theme support</li>
                <li>Real-time data synchronization</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
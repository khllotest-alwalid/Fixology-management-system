import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Phone, Apple } from 'lucide-react';

export default function LoginForm() {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        setLoading(false);
        return;
      }
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">{t('signInOrUp')}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t('smarterAnswers')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('loading') : isSignUp ? t('signUp') : t('signIn')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('or')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" type="button">
              <Chrome className="w-4 h-4 mr-2" />
              {t('continueWithGoogle')}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.64 12.2c0-.63-.05-1.25-.16-1.84H12v3.49h6.44c-.28 1.49-1.12 2.76-2.38 3.61v2.97h3.86c2.25-2.07 3.55-5.12 3.55-8.73z"/>
              </svg>
              {t('continueWithMicrosoft')}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Apple className="w-4 h-4 mr-2" />
              {t('continueWithApple')}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Phone className="w-4 h-4 mr-2" />
              {t('continueWithPhone')}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Button variant="link" size="sm">
              {t('forgotPassword')}
            </Button>
            <div>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? t('alreadyHaveAccount') : t('noAccount')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
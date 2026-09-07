import React, { useState } from 'react';
import { User } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserCircle, Mail, Save, Globe, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface SettingsPageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onNavigate?: (view: string) => void;
}

export function SettingsPage({ user, onSave, onNavigate }: SettingsPageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');

  const handleSave = () => {
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', language);
    
    // Find the language object that matches the current language code
    const selectedLanguage = languages.find(languageOption => languageOption.code === language);
    
    onSave({
      ...user,
      name,
      email
    });

    // Show success toast
    toast.success('Settings saved successfully!', {
      description: `Language preference set to ${selectedLanguage?.name || 'English'}`,
    });
  };

  // Generate user initials from name for avatar display
  const initials = name.split(' ').map(namePart => namePart[0]).join('').toUpperCase();

  const languages = [{ code: 'en', name: 'English', flag: '🇺🇸' }];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 text-white px-3 py-1">Settings</Badge>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      {/* Profile Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-2xl p-8 shadow-lg border-2 border-blue-300">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors border-2 border-blue-300">
              <UserCircle className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1 text-gray-900">{name}</h2>
            <p className="text-gray-900 text-lg capitalize font-medium">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="rounded-t-none shadow-xl border-t-0">
        <CardContent className="p-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="emailAddress"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="shejmark@gmail.com"
              />
            </div>
          </div>

          {/* Read-only Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Role:</span>
              <span className="text-sm text-gray-900 capitalize font-medium">{user.role}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">User ID:</span>
              <span className="text-sm text-gray-900 font-medium">{user.id}</span>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Language Preferences Card */}
      <Card className="shadow-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <CardContent className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            <div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>Language</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>Platform language setting</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--accent)' }}>
            <span style={{ fontSize: '1.25rem' }}>🇺🇸</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>English</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>This platform is English-only</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)' }}>Default</span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

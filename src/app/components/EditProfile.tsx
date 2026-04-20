import React, { useState } from 'react';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserCircle, Mail, Save } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

export function EditProfile({ user, onSave }: EditProfileProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    onSave({
      ...user,
      name,
      email
    });
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-8 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-gray-700 text-white text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
              <UserCircle className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-1">{name}</h2>
            <p className="text-blue-100 text-lg capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="rounded-t-none shadow-xl border-t-0">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
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
    </div>
  );
}

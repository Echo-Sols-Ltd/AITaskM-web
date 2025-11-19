'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import PerformancePrediction from '@/components/PerformancePrediction';
import BurnoutAlert from '@/components/BurnoutAlert';
import AIInsights from '@/components/AIInsights';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  team?: string;
  position?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  joinedDate?: string;
  status?: string;
}

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  streakDays: number;
  points: number;
  badges: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'settings'>('overview');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Get current user from token
      const authResponse = await apiClient.verifyToken();
      setUser(authResponse.user);
      setEditForm(authResponse.user);

      // Get user statistics
      const tasksResponse = await apiClient.getTasks({ 
        assignedTo: authResponse.user.id 
      });
      
      const tasks = tasksResponse.tasks || [];
      const completed = tasks.filter(t => t.status === 'completed').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const pending = tasks.filter(t => t.status === 'pending').length;

      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending,
        completionRate: tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
        averageCompletionTime: 6.5, // Could be calculated from actual data
        streakDays: 7, // Could come from gamification API
        points: 1250, // Could come from gamification API
        badges: 8 // Could come from gamification API
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await apiClient.updateUser(user._id, editForm);
      setUser({ ...user, ...editForm });
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm({ ...editForm, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">Manage your account and view your performance</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editForm.position || ''}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Position"
                />
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Bio"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.position || user.role}</p>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
              </>
            )}

            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.department || 'No department'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {user.team || 'No team'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditForm(user);
                  }}
                  class
                >
ncel
                </button>
              </>
            ) : (
              <button
                onClick=}
                className="px-4lue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
/div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 m
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span 
              <span cl>
iv>
            <div clasdiv>
          </div>

          <div className="bg-white round">
            <div className="flex items-center justify-between mb-2">
              <span className</span>
              <span className="text-2xl">✅</span>
            </div>
            <div clav>
          </div>

          <div classN>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-s
              <span classN>
            </div>
            <div className="text-3xl fys</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justn mb-2">
              <span cl/span>
              <span classNapan>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.points}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="bor>
          <nav className="flex gap->
            <button
              onClick={')}
              className={`py-4 m ${
                activeTab === 'verview'
                  ? 'border-blue-500 text-blue-600'
                  : 'bordecltransparent text-gray-500 hover:text-gray-7-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={(ance')}
              classNam{
ce'
                  ? 'border-blue-500 text-bl'
                  : 'bord
              }`}
            >
              Perfonce
            </button>
            <button
              onClick={()gs')}
              className={`py-4 px-1 border-b-2 font-msm ${
                activeTab === 'settings'
                  ?-blue-600'
                  : 'borde300'
              }`}
            >
              Settings
            </but>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'ov(
        <div class6">

          <BurnoutAlert userId

          {/* AI Insights */}
          <AIInsights userId={user._id} />

          {/* Rece}
 p-6">
            <h3 className="text-lg font-semibold mb-4">Rece3>
            <div classNy-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 round-lg">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p classNam</p>
                  <p className="text->
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="f
                <span claspan>
                <div class
                  <p claadge</p>
                  day</p>
                  <p
              iv>
              </div>
-lg">
                <span className="n>
                <div 
                  <p className="font-medium text-gray-800">Task assigned</p>
                  <p className="text-sm text-gray-600">Review pulp>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Prediction */}
          <Performance

          {/* Task Breakdown */}
          {stats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 classNh3>
              <div className="space-y-4">
      iv>
             
                    <span cla>
                    <span className="text-sm font-semibold text-green-600">{stats.completedTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` 
                    >/div>
                  </div>
                </div>
        >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">an>

                  </div>
                  
                    <div
             "
                      style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}
                    ></div>
                  </div>
                </div
 <div>
                  <div class
              </span>
                    <span clas
                  </div>
                  <div className="w-full bg-gray-200 rounded-ful-2">
                    <div
              "
              
                    ></div>
                  </div>
                </div>
        
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div clace-y-6">
          {//}
      >
  
            <div className="space-y-4">
              <div>
                <label className="bllabel>
                <input
l"
     er.email}
          
                  className="w-full px-3 py-2 border borgray-50"
                />
   </div>
             >
                <l
                <input
                  type="tel"
                  
                  onChange={(e) => setEditForm({ ...editForm, pho })}
                  className="w-full px-3 py-2 border border-gray-300 roun
                  placeholder="+1 (555) 123-4567"
                />
              
              <dv>
                <label className="block text-sm font-medium text-gray-700 >
                <input
                  type="text"
                  value={user.skills?.join(', || ''}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split
                  className="w-full px-3 py-2 border border-gray-3d-md"
                  placeholder="JavaScript, React, Node.js"
          />
              </div>
            </div>
          </div>     {/* Not
}
 );   </div>
 
      )}
 iv>
        </d   </div>       tton>
bu       </    count
 Delete Ac              00">
ed-7ver:bg-r-lg hote rounded600 text-whi bg-red--4 py-2e="pxamutton classN   <b        Zone</h3>
 r ">Dangeed-800 mb-4-rd text-semibolt-lg fontame="tex  <h3 classN
          -lg p-6">edound r-red-200borderborder d-50 g-re"bme=div classNa         < */}
 oner Z   {/* Dange

           </div>div>
         </      
   /label>          <    an>
k alerts</sput ris-700">Burnotext-grayssName="pan cla <s               0" />
ue-60ext-blh-4 t-4 "wName=" classe="checkboxput typ     <in       ">
     gap-3items-center"flex Name=sscla<label               /label>
         <pan>
     ns</sio and suggestinsights00">AI xt-gray-7assName="te  <span cl             />
 -blue-600" w-4 h-4 textassName="ltChecked cldefauox" kb"checnput type=       <i   
      ter gap-3">s-cenem"flex it className=   <label        l>
   labe  </    
        ts</span>k assignmenay-700">Tas"text-grame=ssNspan cla   <       
      00" />t-blue-6-4 h-4 texme="wed classNatCheckx" defaul="checkbout type  <inp    
          gap-3">r ntex items-ceName="fle class      <label    
    l>     </labe       span>
  </tionsnotifica0">Email ext-gray-70="tassNamecl <span          
      />-600" bluetext--4 h-4 sName="wked clasltCheckbox" defauecype="chut t<inp               
 ">er gap-3s-centitemex e="flNamlassl cbe        <la>
      e-y-3"ame="spac<div classN          </h3>
  renceson PrefeNotificati">ibold mb-4semlg font-ext-me="tassNa cl      <h3">
      hadow-md p-6nded-lg soue r"bg-white=div classNam       <}
   Settings */ification 

     
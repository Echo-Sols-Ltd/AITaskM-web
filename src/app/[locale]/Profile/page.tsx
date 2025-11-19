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
  totalPoints: number;
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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Get current user from token
      const authResponse = await apiClient.verifyToken();
      setUser(authResponse.uom token
      const authResponse = await apiClient.verifyToken();
      const currentUser = authResponse.user;
      setUser(currentUser);

      // Load user statistics
      const tasksResponse = await apiClient.getTasks({ 
        assignedTo: currentUser._id 
      });

      const completed = tasksResponse.tasks.filter(t => t.status === 'completed').length;
      const inProgress = tasksResponse.tasks.filter(t => t.status === 'in-progress').length;
      const total = tasksResponse.tasks.length;

      // Get gamification data
      const gamificationData = await apiClient.getUserStreaks(currentUser._id);
      
      setStats({
        totalTasks: total,
        completedTasks: completed,
        inProgressTasks: inProgress,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
        averageCompletionTime: 6.5, // Could be calculated from actual data
        currentStreak: gamificationData?.currentStreak || 0,
        totalPoints: 0, // From gamification
        badges: 0 // From gamification
      });

      // Set edit form
      setEditForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        skills: currentUser.skills || []
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
      await apiClient.updateUser(user._id, {
        name: editForm.name,
        phone: editForm.phone,
        bio: editForm.bio,
        skills: editForm.skills
      });

      setUser({
        ...user,
        name: editForm.name,
        phone: editForm.phone,
        bio: editForm.bio,
        skills: editForm.skills
      });

      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(s => s !== skill)
    });
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

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance & AI Insights
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">{user.position || user.role}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.department && (
                    <p className="text-sm text-gray-500">📍 {user.department}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a skill..."
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {user.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                )}

                {user.bio && (
                  <div>
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="text-gray-800">{user.bio}</p>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistics Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Total Tasks</span>
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{stats.totalTasks}</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.completionRatty tips</p>uctiviwered prodI-po0">Get Aray-50-gtext-sm textme=" <p classNa                 </h4>
nsggestio">AI Su800t-gray-edium texnt-m="fo className       <h4    >
       div <            
   tween">be justify-erx items-cent"fleame=<div classN         
     >
   </div    >
        </label          div>
     </">lue-600ed:bg-beer-checkall psition-ranafter:tafter:w-5 r:h-5 full afteed-er:roundr aft:borde-300 afterr-grayer:bordehite aftbg-w2px] after:r:left-[aftep-[2px] toafter:te absolur:'] afteent-['contfter:-white aorderked:after:bhec peer-cate-x-fullafter:transld:heckeeer peer-cnded-full prou-blue-300 -focus:ringing-4 peerocus:rone peer-fe-noutlinpeer-focus:200 ay- h-6 bg-gr="w-11v className        <di
          />aultChecked peer" def"sr-only Name= classbox"hecke="c<input typ                  >
-pointer"ursornter c-cee-flex items inlin"relativessName=bel cla<la        
            </div>          ks</p>
  out tastes abmail updaReceive e">t-gray-500text-sm texame="p classN  <          4>
      cations</htifi0">Email Nogray-80m text-t-mediu="fon4 className   <h              <div>
                een">
 etw-btifyusnter j items-ceName="flex <div class         
    y-4">space-ame=" classN <div     
        
          rences</h3>mb-4">Prefed font-semibol"text-xl className=<h3      
       ">-6hadow-md punded-lg sg-white rosName="b clas  <div

        v>di   </    
    </div>       >
        </div            </p>
         /A'}
     () : 'NDateStringe).toLocaleedDatte(user.jointe ? new DanedDa {user.joi            ">
     ext-gray-600ssName="t      <p cla     >
     h4r Since</-2">Membe800 mbt-gray-texmedium Name="font-4 class        <h
        div>        <

      </div>            pan>
         </s  
       ole}    {user.r        
      t-sm">-full tex00 roundedrple-8t-putexle-100 -purppx-3 py-1 bgame="<span classN            e</h4>
     mb-2">Rolt-gray-800texont-medium ="f4 className<h         >
            <div
         /div>
           <p>
   nge email</n to chaContact admi500 mt-1">m text-gray-"text-s className=   <p    
         </p>email}">{user.gray-600"text-e=classNamp  <               mail</h4>
">E0 mb-280xt-gray-dium tefont-meclassName="  <h4                   <div>
        
  space-y-4">lassName="  <div c          
            3>
/ht Settings<Accoun">mibold mb-4xl font-setext-lassName="       <h3 c     p-6">
  shadow-mdnded-lge rou="bg-whitName<div class
          e-y-6">Name="spac  <div class&& (
      gs'  'settinTab ===active  {    Tab */}
 /* Settings  {
          )}
</div>
/>
        r._id} ={usetion userIdncePredicrforma    <Pe
      ">"space-y-6me=<div classNa         (
ormance' &&= 'perfveTab ==acti  {*/}
     Tab rmancerfo    {/* Pe  )}

  iv>
     </d/>
       _id} erId={user.ert usBurnoutAl         <lert */}
 ut A{/* Burno  

        )}  >
             </div
       iv>    </d        v>
  sTasks}</dirogres">{stats.inP-600ext-bluet-bold txt-3xl fonsName="te  <div clas            
  iv>         </d>
       </span2xl">⏳Name="text-asspan cl<s                 </span>
 gress">In Protext-sm00 "text-gray-6Name=ssla can <sp              mb-2">
   etween stify-bjuer items-cente="flex classNamdiv         <      >
  ow-md p-6"d-lg shadite rounde="bg-wh className      <div
        </div>
          </div>
    ">daysmt-10 -50 text-gray-sme="textiv classNam      <d        k}</div>
  reantStcurres.at00">{stext-orange-6ont-bold txl fxt-3e="tesNamclas    <div    >
         /div   <            
 </span>xl">🔥"text-2assName= cl  <span       
         span>k</urrent Strea>C00 text-sm"y-6"text-graame=sNclas   <span                ">
n mb-2betweefy-ter justicenems-me="flex itlassNa<div c            
    -6">md p-lg shadow-edte round-whiassName="bg cliv  <d      
      >
   </div           </div>
            n rate
    % completio1)}d(e.toFixe
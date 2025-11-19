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
                className="px-4bg-py-2  
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
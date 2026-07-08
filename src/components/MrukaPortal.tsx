import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, ClipboardList, Calendar, Sparkles, CheckCircle2, 
  Clock, AlertTriangle, Shield, Check, X, ArrowRight, 
  ExternalLink, DollarSign, Filter, RefreshCw, Send,
  Bookmark, Briefcase, Heart, Activity, Sliders, ChevronRight
} from 'lucide-react';
import { ProjectState, ProjectInquiry, BookingDetails, ProjectStatus, MilestoneStatus, ProjectMilestone } from '../types';

interface MrukaPortalProps {
  onBackToHome: () => void;
}

export default function MrukaPortal({ onBackToHome }: MrukaPortalProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Data lists
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectState[]>([]);
  
  // Active Management state
  const [selectedProject, setSelectedProject] = useState<ProjectState | null>(null);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'bookings' | 'projects'>('projects');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default preset projects for administrative seeding
  const PRESET_PROJECTS_DATA: ProjectState[] = [
    {
      id: 'MRK-2026',
      name: 'Fintech Dashboard UI',
      company: 'Capitalize Inc.',
      status: 'In development',
      milestonesCompleted: 3,
      totalMilestones: 4,
      daysRemaining: 12,
      managerName: 'Elena Vasileva',
      managerEmail: 'elena@mruka.agency',
      projectHealth: 'Healthy',
      progressPercentage: 75,
      milestones: [
        {
          id: '1',
          name: 'Brand & UX Strategy',
          description: 'Establish design guidelines, color themes, typographic pairing, and key visual wires.',
          status: 'Completed',
          dueDate: '2026-06-15',
        },
        {
          id: '2',
          name: 'High-Fidelity Dashboard Layouts',
          description: 'Interactive layouts for multi-currency transactions, investment portfolio grids, and chart visuals.',
          status: 'Completed',
          dueDate: '2026-06-28',
        },
        {
          id: '3',
          name: 'React Frontend Implementation',
          description: 'Coding standard templates, Vite integration, responsive grids, and Recharts components integration.',
          status: 'In Progress',
          dueDate: '2026-07-10',
          requiresClientAction: true,
          clientActionLabel: 'Approve typography pairing and charts layout'
        },
        {
          id: '4',
          name: 'Live Beta & Sandbox Environment',
          description: 'Initial secure sandbox staging deployment with production API mock proxies.',
          status: 'Pending',
          dueDate: '2026-07-22',
        }
      ]
    },
    {
      id: 'MRK-1002',
      name: 'E-Commerce Mobile App',
      company: 'Silk & Thread',
      status: 'Delivered',
      milestonesCompleted: 4,
      totalMilestones: 4,
      daysRemaining: 0,
      managerName: 'Marcus Thorne',
      managerEmail: 'marcus@mruka.agency',
      projectHealth: 'Healthy',
      progressPercentage: 100,
      milestones: [
        {
          id: '1',
          name: 'App Store Guidelines Review & UX',
          description: 'Draft layout wires compliant with App Store and Google Play usability patterns.',
          status: 'Completed',
          dueDate: '2026-04-10',
        },
        {
          id: '2',
          name: 'Stripe Payment Flow Integration',
          description: 'Secure, tokenized checkout APIs, dynamic tax calculations, and automatic receipt generation.',
          status: 'Completed',
          dueDate: '2026-05-02',
        },
        {
          id: '3',
          name: 'Inventory Syncing Pipelines',
          description: 'Linking stock systems to Shopify/WooCommerce engines to keep catalog listings real-time.',
          status: 'Completed',
          dueDate: '2026-05-18',
        },
        {
          id: '4',
          name: 'Final App Store Launch & Verification',
          description: 'Build compilation, beta deployment via TestFlight, and final production rollout approval.',
          status: 'Completed',
          dueDate: '2026-06-01',
        }
      ]
    },
    {
      id: 'MRK-3030',
      name: 'AI Support Agent Integration',
      company: 'Apex Solutions',
      status: 'On hold',
      milestonesCompleted: 2,
      totalMilestones: 4,
      daysRemaining: 18,
      managerName: 'Elena Vasileva',
      managerEmail: 'elena@mruka.agency',
      projectHealth: 'Needs Attention',
      progressPercentage: 50,
      milestones: [
        {
          id: '1',
          name: 'Core Agent Architecture',
          description: 'Integrate custom embeddings using workspace data and specify precise prompt behaviors.',
          status: 'Completed',
          dueDate: '2026-05-20',
        },
        {
          id: '2',
          name: 'API Webhook Connection',
          description: 'Connecting chat flow nodes with existing Zendesk, Slack, and email ticket APIs.',
          status: 'Completed',
          dueDate: '2026-06-05',
        },
        {
          id: '3',
          name: 'Human-in-the-Loop Safeguards',
          description: 'Interactive escalation dashboard for when the AI agent detects complex queries.',
          status: 'Delayed',
          dueDate: '2026-06-25',
          requiresClientAction: true,
          clientActionLabel: 'Approve agent safety prompt and tone guidelines'
        },
        {
          id: '4',
          name: 'Enterprise Beta Staging Test',
          description: 'A 14-day simulated customer support pilot deployment with selected user groups.',
          status: 'Pending',
          dueDate: '2026-07-15',
        }
      ]
    }
  ];

  // Load and sync admin datasets
  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = () => {
    // 1. Inquiries
    const savedInquiries = localStorage.getItem('mruka_inquiries');
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    } else {
      // Seed some mock inquiries if empty to show a beautiful initial portal state
      const seedInquiries: ProjectInquiry[] = [
        {
          id: 'INQ-4201',
          name: 'Sarah Jenkins',
          email: 'sarah@fintechflow.co',
          phone: '+1 (555) 321-8899',
          company: 'FinTechFlow Corp',
          projectTitle: 'Interactive Wealth Dashboard',
          problemDescription: 'We need a highly polished dashboard rendering real-time portfolio returns using custom Recharts. Visual elegance and clear typographic hierarchy is paramount.',
          softwareType: 'webapp',
          budgetRange: '$25,000 - $50,000',
          timeline: '3 to 6 months',
          marketingChannel: 'LinkedIn',
          submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        },
        {
          id: 'INQ-9012',
          name: 'David Chen',
          email: 'dchen@boldsound.io',
          phone: '+1 (555) 987-1234',
          company: 'BoldSound Studios',
          projectTitle: 'AI Audio Synthesis Platform',
          problemDescription: 'Automated workflow mapping MIDI inputs into custom DSP algorithms. Needs an elegant Web Audio API layout and responsive controls.',
          softwareType: 'website',
          budgetRange: '$10,000 - $25,000',
          timeline: '1 to 3 months',
          marketingChannel: 'Google / Search Engine',
          submittedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString()
        }
      ];
      localStorage.setItem('mruka_inquiries', JSON.stringify(seedInquiries));
      setInquiries(seedInquiries);
    }

    // 2. Bookings
    const savedBookings = localStorage.getItem('mruka_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const seedBookings = [
        {
          id: 'BKG-8831',
          inquiryId: 'INQ-4201',
          date: '2026-07-10',
          timeSlot: '10:00 AM',
          meetingType: 'video',
          bookedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
          projectCode: 'MRK-2026',
          clientName: 'Sarah Jenkins',
          clientEmail: 'sarah@fintechflow.co',
          clientCompany: 'FinTechFlow Corp',
          projectTitle: 'Interactive Wealth Dashboard'
        },
        {
          id: 'BKG-1122',
          inquiryId: 'INQ-9012',
          date: '2026-07-12',
          timeSlot: '02:30 PM',
          meetingType: 'phone',
          bookedAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
          projectCode: 'MRK-4040',
          clientName: 'David Chen',
          clientEmail: 'dchen@boldsound.io',
          clientCompany: 'BoldSound Studios',
          projectTitle: 'AI Audio Synthesis Platform'
        }
      ];
      localStorage.setItem('mruka_bookings', JSON.stringify(seedBookings));
      setBookings(seedBookings);
    }

    // 3. Projects list (including dynamic local storages & presets seeded)
    const seedActiveProjects: ProjectState[] = [];
    
    // Check custom booked projects or presets in local storage
    PRESET_PROJECTS_DATA.forEach(preset => {
      const stored = localStorage.getItem(`project_${preset.id}`);
      if (stored) {
        seedActiveProjects.push(JSON.parse(stored));
      } else {
        localStorage.setItem(`project_${preset.id}`, JSON.stringify(preset));
        seedActiveProjects.push(preset);
      }
    });

    // Check key patterns in localStorage for other booked codes
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('project_')) {
        const id = key.replace('project_', '');
        if (id !== 'MRK-2026' && id !== 'MRK-1002' && id !== 'MRK-3030') {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data && data.id) {
              seedActiveProjects.push(data);
            }
          } catch (e) {
            console.error('Error parsing project data from localStorage', e);
          }
        }
      }
    }

    setProjects(seedActiveProjects);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'mruka2026' || passcode === 'agency' || passcode === 'coinbase') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Successfully logged in as Mruka Administrator');
    } else {
      setAuthError('Access Denied. Invalid agency secure passcode.');
    }
  };

  // Delete inquiry
  const handleDeleteInquiry = (id: string) => {
    const filtered = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem('mruka_inquiries', JSON.stringify(filtered));
    setInquiries(filtered);
    showToast(`Inquiry ${id} removed successfully`);
  };

  // Delete booking
  const handleDeleteBooking = (id: string) => {
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.setItem('mruka_bookings', JSON.stringify(filtered));
    setBookings(filtered);
    showToast(`Booking ${id} deleted`);
  };

  // Update selected project properties in storage and locally
  const handleUpdateProject = (updatedProj: ProjectState) => {
    localStorage.setItem(`project_${updatedProj.id}`, JSON.stringify(updatedProj));
    // Also save in static list
    const updatedList = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(updatedList);
    setSelectedProject(updatedProj);
    showToast(`Project ${updatedProj.id} updated successfully`);
  };

  const handleUpdateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    if (!selectedProject) return;
    
    const updatedMilestones = selectedProject.milestones.map(m => {
      if (m.id === milestoneId) {
        let update: Partial<ProjectMilestone> = { status };
        if (status === 'Completed') {
          update.requiresClientAction = false; // complete clears action
        }
        return { ...m, ...update };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter(m => m.status === 'Completed').length;
    const progressVal = Math.round((completedCount / selectedProject.totalMilestones) * 100);

    const updated: ProjectState = {
      ...selectedProject,
      milestonesCompleted: completedCount,
      progressPercentage: progressVal,
      milestones: updatedMilestones
    };

    handleUpdateProject(updated);
  };

  const toggleClientAction = (milestoneId: string, requireAction: boolean, label: string = '') => {
    if (!selectedProject) return;

    const updatedMilestones = selectedProject.milestones.map(m => {
      if (m.id === milestoneId) {
        return { 
          ...m, 
          requiresClientAction: requireAction, 
          clientActionLabel: requireAction ? label : undefined 
        };
      }
      return m;
    });

    const updated: ProjectState = {
      ...selectedProject,
      milestones: updatedMilestones
    };

    handleUpdateProject(updated);
  };

  const handleStatusChange = (status: ProjectStatus) => {
    if (!selectedProject) return;
    const updated: ProjectState = { ...selectedProject, status };
    handleUpdateProject(updated);
  };

  const handleHealthChange = (projectHealth: 'Healthy' | 'Needs Attention' | 'At Risk') => {
    if (!selectedProject) return;
    const updated: ProjectState = { ...selectedProject, projectHealth };
    handleUpdateProject(updated);
  };

  const handleDaysChange = (days: number) => {
    if (!selectedProject) return;
    const updated: ProjectState = { ...selectedProject, daysRemaining: days };
    handleUpdateProject(updated);
  };

  const handleProjectSelect = (proj: ProjectState) => {
    setSelectedProject(proj);
  };

  const filteredProjects = projects.filter(p => {
    if (projectFilter === 'all') return true;
    return p.status.toLowerCase() === projectFilter.toLowerCase();
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#2D3A31] text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 size={16} className="text-[#AFCFB5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="p-2 bg-white/40 border border-white/60 hover:bg-white/60 rounded-full text-foreground/70 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Agency Hub</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight">Mruka Partner Portal</h1>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                loadAllData();
                showToast("System metrics and data lists synchronized!");
              }} 
              className="px-4 py-2 bg-white/40 hover:bg-white/60 border border-white/60 text-xs font-semibold rounded-full flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={12} /> Sync Lists
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-xs font-semibold rounded-full transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        /* Lock Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto soft-glass rounded-[2rem] border-white/60 p-8 text-center space-y-6 shadow-xl mt-12"
        >
          <div className="h-14 w-14 rounded-2xl bg-[#AFCFB5]/20 flex items-center justify-center mx-auto text-[#7AA884]">
            <Shield size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-foreground">Secure Agency Entrance</h2>
            <p className="text-xs font-body text-foreground/60 leading-relaxed max-w-sm mx-auto">
              Please provide the secure Mruka admin passcode to monitor and update client bookings and project milestones.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider pl-1">Passcode</label>
              <input 
                type="password" 
                placeholder="Enter admin passcode" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full rounded-2xl bg-white/60 border border-white/80 focus:border-[#7AA884] focus:ring-0 p-3.5 text-sm font-mono tracking-widest text-center"
              />
              <div className="flex justify-between items-center text-[10px] text-foreground/40 pt-1.5 pl-1">
                <span>Passcode hint: <strong className="font-semibold text-[#7AA884]">mruka2026</strong></span>
                <span>Role: Manager</span>
              </div>
            </div>

            {authError && (
              <p className="text-xs font-semibold text-red-500 bg-red-50/50 p-2 rounded-xl flex items-center gap-2 justify-center border border-red-100">
                <AlertTriangle size={12} /> {authError}
              </p>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#2D3A31] text-white rounded-full py-3.5 text-xs font-semibold hover:bg-[#2D3A31]/90 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Verify Identity <ArrowRight size={14} />
            </button>
          </form>
        </motion.div>
      ) : (
        /* Main Dashboard Portal */
        <div className="space-y-6">
          {/* Top Level Summary Statistics Panels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="soft-glass rounded-2xl p-5 border-white/60 text-left space-y-2">
              <div className="flex justify-between items-center text-foreground/50">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Projects</span>
                <Briefcase size={16} className="text-[#7AA884]" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{projects.length}</div>
              <p className="text-[10px] text-foreground/40 leading-none">Active trackers under sync</p>
            </div>
            
            <div className="soft-glass rounded-2xl p-5 border-white/60 text-left space-y-2">
              <div className="flex justify-between items-center text-foreground/50">
                <span className="text-[10px] font-bold uppercase tracking-wider">Discovery Bookings</span>
                <Calendar size={16} className="text-[#7AA884]" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{bookings.length}</div>
              <p className="text-[10px] text-foreground/40 leading-none">Discovery sessions scheduled</p>
            </div>

            <div className="soft-glass rounded-2xl p-5 border-white/60 text-left space-y-2">
              <div className="flex justify-between items-center text-foreground/50">
                <span className="text-[10px] font-bold uppercase tracking-wider">New Inquiries</span>
                <ClipboardList size={16} className="text-[#7AA884]" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{inquiries.length}</div>
              <p className="text-[10px] text-foreground/40 leading-none">Waiting for strategy blueprint</p>
            </div>

            <div className="soft-glass rounded-2xl p-5 border-white/60 text-left space-y-2 bg-[#AFCFB5]/10">
              <div className="flex justify-between items-center text-foreground/50">
                <span className="text-[10px] font-bold uppercase tracking-wider">Healthy Rate</span>
                <Activity size={16} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                {projects.length > 0 ? Math.round((projects.filter(p => p.projectHealth === 'Healthy').length / projects.length) * 100) : 100}%
              </div>
              <p className="text-[10px] text-emerald-600/70 leading-none">Target index: 95% minimum</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-foreground/10 pb-1">
            <div className="flex gap-4">
              <button
                onClick={() => { setActiveTab('projects'); setSelectedProject(null); }}
                className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'projects' ? 'border-[#2D3A31] text-[#2D3A31]' : 'border-transparent text-foreground/40 hover:text-foreground/70'
                }`}
              >
                Trackers & Milestone Management ({projects.length})
              </button>
              <button
                onClick={() => { setActiveTab('inquiries'); setSelectedProject(null); }}
                className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'inquiries' ? 'border-[#2D3A31] text-[#2D3A31]' : 'border-transparent text-foreground/40 hover:text-foreground/70'
                }`}
              >
                Project Inquiries ({inquiries.length})
              </button>
              <button
                onClick={() => { setActiveTab('bookings'); setSelectedProject(null); }}
                className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'bookings' ? 'border-[#2D3A31] text-[#2D3A31]' : 'border-transparent text-foreground/40 hover:text-foreground/70'
                }`}
              >
                Discovery Call Schedule ({bookings.length})
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* INQUIRIES LIST VIEW */}
            {activeTab === 'inquiries' && (
              <div className="lg:col-span-12 space-y-4 text-left">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12 soft-glass rounded-2xl border-white/60">
                    <ClipboardList className="mx-auto text-foreground/20 mb-4" size={32} />
                    <p className="text-sm font-medium text-foreground/50 font-heading">No inquiries found</p>
                    <p className="text-xs text-foreground/40 font-body">New inquiries submitted by clients will appear here instantly.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="soft-glass rounded-2xl p-6 border-white/60 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-heading font-semibold text-lg text-foreground leading-tight">{inq.projectTitle}</h3>
                              <p className="text-[11px] font-bold text-[#7AA884] uppercase tracking-wider mt-1">{inq.company}</p>
                            </div>
                            <span className="font-mono text-[9px] font-bold text-foreground/40 bg-white/60 px-2 py-0.5 rounded-full border border-white/80">
                              {inq.id}
                            </span>
                          </div>

                          <div className="bg-white/40 border border-white/60 rounded-xl p-3 text-xs text-foreground/70 leading-relaxed font-body">
                            {inq.problemDescription}
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <span className="text-[10px] text-foreground/40 uppercase font-bold block">Contact</span>
                              <span className="font-medium text-foreground">{inq.name}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-foreground/40 uppercase font-bold block">Budget Limit</span>
                              <span className="font-medium font-mono text-[#2D3A31]">{inq.budgetRange}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-foreground/40 uppercase font-bold block">Timeline Target</span>
                              <span className="font-medium text-foreground">{inq.timeline}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-foreground/40 uppercase font-bold block">Inquiry Type</span>
                              <span className="font-medium text-foreground capitalize">{inq.softwareType}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/30 text-[10px] text-foreground/40 font-body flex justify-between items-center">
                            <span>Source: {inq.marketingChannel}</span>
                            <span>Submitted: {new Date(inq.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-between gap-3">
                          <a 
                            href={`mailto:${inq.email}?subject=Mruka Digital Agency - Response to Inquiry ${inq.projectTitle}`}
                            className="bg-[#2D3A31] text-white rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-[#2D3A31]/90 flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <Send size={12} /> Contact Client
                          </a>
                          <button 
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer"
                          >
                            Remove Inquiry
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BOOKINGS LIST VIEW */}
            {activeTab === 'bookings' && (
              <div className="lg:col-span-12 space-y-4 text-left">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 soft-glass rounded-2xl border-white/60">
                    <Calendar className="mx-auto text-foreground/20 mb-4" size={32} />
                    <p className="text-sm font-medium text-foreground/50 font-heading">No discovery calls booked yet</p>
                    <p className="text-xs text-foreground/40 font-body">When clients book slots using the interactive calendar, details populate here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto soft-glass rounded-[2rem] border-white/60 p-6">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-foreground/10 text-foreground/40 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 font-semibold">Client / Company</th>
                          <th className="pb-3 font-semibold">Proposed Project</th>
                          <th className="pb-3 font-semibold">Scheduled Time Slot</th>
                          <th className="pb-3 font-semibold">Meeting Mode</th>
                          <th className="pb-3 font-semibold">Assigned Track ID</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/20">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-white/10 transition-colors">
                            <td className="py-4 pr-3">
                              <div className="font-semibold text-foreground text-sm leading-tight">{b.clientName}</div>
                              <div className="text-[10px] text-foreground/40 mt-0.5">{b.clientCompany} • {b.clientEmail}</div>
                            </td>
                            <td className="py-4 pr-3">
                              <span className="font-medium text-foreground leading-snug">{b.projectTitle}</span>
                            </td>
                            <td className="py-4 pr-3">
                              <div className="font-bold text-foreground/80 flex items-center gap-1.5 font-mono">
                                <Clock size={12} className="text-[#7AA884]" /> {b.date} • {b.timeSlot}
                              </div>
                            </td>
                            <td className="py-4 pr-3 capitalize">
                              <span className="px-2 py-0.5 bg-white border border-white/80 rounded-full font-semibold text-foreground/70">
                                {b.meetingType} call
                              </span>
                            </td>
                            <td className="py-4 pr-3">
                              <code className="text-xs font-mono font-bold text-[#2D3A31] bg-[#AFCFB5]/20 px-2 py-0.5 rounded-md border border-[#AFCFB5]/40">
                                {b.projectCode || 'MRK-NEW'}
                              </code>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-3">
                                <a 
                                  href={`https://meet.google.com/new`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[11px] font-bold text-[#7AA884] hover:underline flex items-center gap-1"
                                >
                                  Join Meet <ExternalLink size={10} />
                                </a>
                                <button 
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS MANAGEMENT VIEW */}
            {activeTab === 'projects' && (
              <>
                {/* Left Side: Trackers List */}
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 pl-1">Live Project Trackers</h2>
                    <div className="flex items-center gap-1.5 bg-white/40 border border-white/60 rounded-full px-2 py-0.5 text-[10px]">
                      <Filter size={10} />
                      <select 
                        value={projectFilter} 
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="bg-transparent border-0 focus:ring-0 p-0 pr-6 text-[10px] font-bold text-foreground/70"
                      >
                        <option value="all">All statuses</option>
                        <option value="in development">In development</option>
                        <option value="pending approval">Pending Approval</option>
                        <option value="on hold">On hold</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleProjectSelect(p)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          selectedProject?.id === p.id 
                            ? 'bg-white shadow-md border-[#2D3A31] ring-1 ring-[#2D3A31]/20' 
                            : 'bg-white/40 hover:bg-white/60 border-white/60'
                        }`}
                      >
                        <div className="w-full flex justify-between items-start">
                          <div>
                            <h3 className="font-heading font-semibold text-sm text-foreground leading-tight">{p.name}</h3>
                            <p className="text-[10px] text-foreground/40 mt-0.5">{p.company}</p>
                          </div>
                          <code className="font-mono text-xs font-bold text-[#2D3A31] bg-[#AFCFB5]/20 px-2 py-0.5 rounded border border-[#AFCFB5]/40 leading-none">
                            {p.id}
                          </code>
                        </div>

                        {/* Progress Bar Mini */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-foreground/50">
                            <span>Milestones</span>
                            <span>{p.milestonesCompleted}/{p.totalMilestones} Completed</span>
                          </div>
                          <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7AA884] rounded-full transition-all duration-500" style={{ width: `${p.progressPercentage}%` }}></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-semibold border-t border-white/40 pt-2 leading-none">
                          <span className={`px-2 py-0.5 rounded-full ${
                            p.projectHealth === 'Healthy' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {p.projectHealth}
                          </span>
                          <span className="text-foreground/50 font-mono">
                            {p.daysRemaining} days left
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side: Milestone & Status Workspace */}
                <div className="lg:col-span-7">
                  {selectedProject ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="soft-glass rounded-[2rem] p-6 border-white/60 text-left space-y-6"
                    >
                      {/* Project Meta Workspace */}
                      <div className="border-b border-foreground/10 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Active Workspace</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-mono font-bold uppercase rounded">Sync Live</span>
                          </div>
                          <h2 className="text-xl font-heading font-semibold text-foreground tracking-tight mt-0.5">{selectedProject.name}</h2>
                          <p className="text-xs font-semibold text-[#7AA884] uppercase tracking-wide font-body mt-0.5">{selectedProject.company} • PM: {selectedProject.managerName}</p>
                        </div>
                        <code className="text-lg font-mono font-bold text-[#2D3A31] bg-[#AFCFB5]/25 border border-[#AFCFB5]/50 px-3.5 py-1.5 rounded-xl self-start">
                          {selectedProject.id}
                        </code>
                      </div>

                      {/* State Editors */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/40 border border-white/60 rounded-2xl p-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Tracker Status</label>
                          <select 
                            value={selectedProject.status} 
                            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                            className="w-full bg-white/80 border border-white/80 hover:bg-white rounded-xl p-2.5 text-xs font-semibold text-foreground/80 focus:ring-0 cursor-pointer"
                          >
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="In development">In development</option>
                            <option value="On hold">On hold</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Project Health</label>
                          <select 
                            value={selectedProject.projectHealth} 
                            onChange={(e) => handleHealthChange(e.target.value as any)}
                            className="w-full bg-white/80 border border-white/80 hover:bg-white rounded-xl p-2.5 text-xs font-semibold text-foreground/80 focus:ring-0 cursor-pointer"
                          >
                            <option value="Healthy">Healthy</option>
                            <option value="Needs Attention">Needs Attention</option>
                            <option value="At Risk">At Risk</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Days Remaining</label>
                          <input 
                            type="number" 
                            value={selectedProject.daysRemaining} 
                            onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-white/80 border border-white/80 hover:bg-white rounded-xl p-2.5 text-xs font-mono font-bold text-foreground/80 focus:ring-0 text-center"
                          />
                        </div>
                      </div>

                      {/* Milestones Control Workspace */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 pl-1">Milestones Control</h3>
                        
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {selectedProject.milestones.map((m) => (
                            <div key={m.id} className="bg-white/60 border border-white/80 rounded-2xl p-4 text-left space-y-3">
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <h4 className="text-xs font-bold text-foreground leading-tight">{m.name}</h4>
                                  <p className="text-[10px] font-body text-foreground/50 leading-relaxed mt-0.5">{m.description}</p>
                                </div>
                                <span className="text-[9px] font-semibold text-foreground/40 uppercase font-mono leading-none bg-white border border-white/80 px-2 py-0.5 rounded-full">
                                  Due: {m.dueDate}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/50">
                                {/* Milestone status toggler */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mr-1">Status:</span>
                                  {(['Completed', 'In Progress', 'Pending', 'Delayed'] as MilestoneStatus[]).map((st) => (
                                    <button
                                      key={st}
                                      onClick={() => handleUpdateMilestoneStatus(m.id, st)}
                                      className={`px-2 py-1 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                                        m.status === st
                                          ? st === 'Completed'
                                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-extrabold'
                                            : st === 'In Progress'
                                            ? 'bg-blue-100 border-blue-300 text-blue-800 font-extrabold'
                                            : st === 'Delayed'
                                            ? 'bg-red-100 border-red-300 text-red-800 font-extrabold'
                                            : 'bg-amber-100 border-amber-300 text-amber-800 font-extrabold'
                                          : 'bg-transparent border-white/60 text-foreground/40 hover:bg-white/40'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>

                                {/* Client Action Toggle */}
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Require Action:</span>
                                  <input 
                                    type="checkbox" 
                                    checked={m.requiresClientAction || false}
                                    onChange={(e) => {
                                      const requires = e.target.checked;
                                      toggleClientAction(
                                        m.id, 
                                        requires, 
                                        requires ? (m.clientActionLabel || 'Please review & sign off blueprint details') : ''
                                      );
                                    }}
                                    className="rounded border-gray-300 text-[#7AA884] focus:ring-[#7AA884]"
                                  />
                                </div>
                              </div>

                              {/* Client Action prompt text */}
                              {m.requiresClientAction && (
                                <div className="pt-2 flex gap-2 items-center">
                                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider font-mono">Alert Prompt:</span>
                                  <input 
                                    type="text" 
                                    value={m.clientActionLabel || ''} 
                                    onChange={(e) => toggleClientAction(m.id, true, e.target.value)}
                                    placeholder="Type instructions (e.g., Approve typographic blueprint)"
                                    className="flex-1 bg-white border border-white rounded-lg px-2 py-1 text-[10px] text-foreground font-body focus:ring-[#7AA884]"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sync Feedback */}
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 text-xs font-semibold leading-relaxed flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                        <p className="font-body">
                          This project is synchronizing directly with localStorage key <code className="font-mono text-[10px] px-1 bg-white border border-emerald-200 rounded">project_{selectedProject.id}</code>. If your client enters this code in the Track Project view, they will see your updates live!
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center p-12 soft-glass rounded-[2rem] border-white/60 min-h-[300px]">
                      <Sliders size={32} className="text-foreground/20 mb-4" />
                      <p className="text-sm font-medium font-heading text-foreground/50">Select a project tracker to manage</p>
                      <p className="text-xs text-foreground/40 font-body text-center max-w-xs mt-1">
                        Select from active client projects or preset models on the left to edit health indices, shift timeline statuses, or trigger client actions.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

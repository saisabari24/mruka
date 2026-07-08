import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Clock, Calendar, ShieldCheck, ArrowRight, 
  Search, RefreshCw, User, Mail, DollarSign, Heart, 
  ChevronLeft, AlertTriangle, HelpCircle, Check, ArrowUpRight
} from 'lucide-react';
import { ProjectState, ProjectStatus, MilestoneStatus } from '../types';

// Seed initial preset projects to make it fully testable
const PRESET_PROJECTS: Record<string, ProjectState> = {
  'MRK-2026': {
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
  'MRK-1002': {
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
  'MRK-3030': {
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
};

interface ProjectTrackerProps {
  onBackToHome: () => void;
}

export default function ProjectTracker({ onBackToHome }: ProjectTrackerProps) {
  const [projectCode, setProjectCode] = useState('');
  const [activeProject, setActiveProject] = useState<ProjectState | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isApproved, setIsApproved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if there is an active project code stored from a recent booking
    const savedCode = localStorage.getItem('active_project_code');
    if (savedCode) {
      loadProject(savedCode);
    }
  }, []);

  const loadProject = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    
    // Check presets first
    let project = PRESET_PROJECTS[uppercaseCode];
    
    // Check localStorage (for dynamically generated booking projects)
    if (!project) {
      const stored = localStorage.getItem(`project_${uppercaseCode}`);
      if (stored) {
        project = JSON.parse(stored);
      }
    }

    if (project) {
      setActiveProject(project);
      setProjectCode(uppercaseCode);
      setSearchError('');
    } else {
      setSearchError('Invalid Project ID. Try MRK-2026, MRK-3030, or MRK-1002.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectCode.trim()) return;
    loadProject(projectCode);
  };

  const handleApproveAction = (milestoneId: string) => {
    setIsApproved(prev => ({ ...prev, [milestoneId]: true }));
    
    // Update local copy of milestone status optionally for visual feedback
    if (activeProject) {
      const updatedMilestones = activeProject.milestones.map(m => {
        if (m.id === milestoneId) {
          return { ...m, status: 'Completed' as MilestoneStatus, requiresClientAction: false };
        }
        return m;
      });

      const updatedProject: ProjectState = {
        ...activeProject,
        milestonesCompleted: activeProject.milestonesCompleted + 1,
        progressPercentage: Math.round(((activeProject.milestonesCompleted + 1) / activeProject.totalMilestones) * 100),
        milestones: updatedMilestones
      };
      
      setActiveProject(updatedProject);
      localStorage.setItem(`project_${activeProject.id}`, JSON.stringify(updatedProject));
    }
  };

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch (status) {
      case 'In development':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'On hold':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Pending Approval':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getMilestoneStatusBadgeClass = (status: MilestoneStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700';
      case 'Delayed':
        return 'bg-red-100 text-red-700';
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getHealthBadgeClass = (health: 'Healthy' | 'Needs Attention' | 'At Risk') => {
    switch (health) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Needs Attention':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'At Risk':
        return 'bg-red-100 text-red-800 border border-red-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 min-h-[80vh]">
      {/* Back to Home Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        {activeProject && (
          <button
            onClick={() => {
              setActiveProject(null);
              setProjectCode('');
            }}
            className="text-xs font-semibold text-foreground/50 hover:text-foreground underline"
          >
            Switch Project ID
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeProject ? (
          /* Search / Login Screen */
          <motion.div
            key="tracker-search"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-lg mx-auto text-center space-y-8 py-12"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 mb-2 bg-[#AFCFB5]/15 px-4 py-1 rounded-full text-foreground text-xs font-semibold">
                <ShieldCheck size={14} className="text-[#7AA884]" /> Live Milestones Tracker
              </div>
              <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground">
                Enter your Project ID
              </h1>
              <p className="text-sm text-foreground/60 font-body leading-relaxed max-w-sm mx-auto">
                No password required. Connect immediately to your workspace using the unique code received in your email.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., MRK-2026, MRK-3030, or MRK-1002"
                  value={projectCode}
                  onChange={(e) => {
                    setProjectCode(e.target.value);
                    setSearchError('');
                  }}
                  className="w-full bg-white/60 border border-white/80 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold tracking-wide text-foreground focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-mono"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              </div>
              
              {searchError && (
                <p className="text-red-500 text-xs font-body text-left px-2">{searchError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#2D3A31] text-white rounded-full py-4 text-xs font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] transform"
              >
                Track Live Progress <ArrowRight size={14} />
              </button>
            </form>

            <div className="border-t border-white/40 pt-6 space-y-4 text-left">
              <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-widest text-center sm:text-left">Sample Codes to Test Preview</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'MRK-2026', label: 'Fintech UI (In Dev)' },
                  { code: 'MRK-3030', label: 'AI Agent (On Hold)' },
                  { code: 'MRK-1002', label: 'E-Comm App (Delivered)' }
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => loadProject(item.code)}
                    className="p-3 text-xs bg-white/40 hover:bg-white border border-white/60 rounded-xl font-semibold font-mono text-center shadow-sm transition-all text-[#2D3A31]"
                  >
                    {item.code}
                    <span className="block font-sans text-[9px] text-foreground/50 font-normal mt-0.5">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Project Dashboard Dashboard */
          <motion.div
            key="tracker-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Project Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 border border-white/60 p-6 md:p-8 rounded-[2rem]">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#7AA884] bg-[#AFCFB5]/20 px-2.5 py-0.5 rounded-full uppercase">
                    {activeProject.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(activeProject.status)}`}>
                    {activeProject.status}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-heading font-medium tracking-tight text-foreground">
                  {activeProject.name}
                </h1>
                <p className="text-xs text-foreground/50 font-body">
                  Client Account: <strong className="text-foreground/70 font-semibold">{activeProject.company}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto bg-white/60 border border-white/80 rounded-2xl px-4 py-2.5">
                <RefreshCw size={14} className="text-[#7AA884] animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                  Live Sync Connected
                </span>
              </div>
            </div>

            {/* Metric Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Milestones Completed', value: `${activeProject.milestonesCompleted}/${activeProject.totalMilestones}`, subtitle: 'Active targets complete', icon: CheckCircle2, color: 'text-green-600' },
                { title: 'Days Remaining', value: activeProject.daysRemaining, subtitle: 'Estimated release date', icon: Clock, color: 'text-purple-600' },
                { title: 'Project Health', value: activeProject.projectHealth, subtitle: 'Workspace status', icon: Heart, color: 'text-rose-600', badge: getHealthBadgeClass(activeProject.projectHealth) },
                { title: 'Delivery Manager', value: activeProject.managerName, subtitle: activeProject.managerEmail, icon: User, color: 'text-[#7AA884]' }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-white/40 border border-white/60 rounded-[1.5rem] p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider leading-none">
                        {card.title}
                      </p>
                      {card.badge ? (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`text-base font-heading font-semibold px-2.5 py-0.5 rounded-full text-xs ${card.badge}`}>
                            {card.value}
                          </span>
                        </div>
                      ) : (
                        <h3 className="text-xl md:text-2xl font-heading font-medium text-foreground mt-2 leading-none">
                          {card.value}
                        </h3>
                      )}
                    </div>
                    <p className="text-[10px] text-foreground/60 font-body leading-none">
                      {card.subtitle}
                    </p>
                    <Icon size={16} className={`absolute top-4 right-4 ${card.color} opacity-40`} />
                  </div>
                );
              })}
            </div>

            {/* Progress Bar Container */}
            <div className="bg-white/40 border border-white/60 rounded-[2rem] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground/75 uppercase tracking-wider">Total Blueprint Completion</span>
                <span className="text-sm font-mono font-bold text-foreground">{activeProject.progressPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/45 rounded-full overflow-hidden border border-white/60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeProject.progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#AFCFB5] to-[#7AA884]"
                />
              </div>
            </div>

            {/* Milestones Checklist Stack */}
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-medium text-foreground">Timeline Milestones Checklist</h2>
              
              <div className="space-y-4">
                {activeProject.milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`bg-white/40 rounded-[2rem] p-6 md:p-8 border-2 transition-all ${
                      milestone.requiresClientAction 
                        ? 'border-amber-200 shadow-sm bg-amber-50/10' 
                        : 'border-white/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${
                          milestone.status === 'Completed' 
                            ? 'text-green-600 bg-green-50' 
                            : milestone.status === 'In Progress' 
                              ? 'text-purple-600 bg-purple-50'
                              : milestone.status === 'Delayed'
                                ? 'text-red-600 bg-red-50 animate-pulse'
                                : 'text-gray-400 bg-gray-50'
                        }`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
                            {milestone.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50 font-body">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> Target: {milestone.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full leading-none ${getMilestoneStatusBadgeClass(milestone.status)}`}>
                        {milestone.status}
                      </span>
                    </div>

                    <p className="text-sm text-foreground/75 font-body leading-relaxed max-w-2xl pl-8">
                      {milestone.description}
                    </p>

                    {/* Customer Action Requirements Block */}
                    {milestone.requiresClientAction && (
                      <div className="mt-6 border-t border-amber-200/55 pt-5 pl-8 space-y-4">
                        <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                          <AlertTriangle size={14} className="text-amber-600" /> Action Required
                        </div>
                        <p className="text-xs font-body text-foreground/70">
                          To keep this milestone on timeline schedule, please review and approve: <strong>"{milestone.clientActionLabel}"</strong>.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {isApproved[milestone.id] ? (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              <Check size={14} /> Approved Successfully
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApproveAction(milestone.id)}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center gap-1.5"
                              >
                                Approve Design Layouts <ArrowUpRight size={14} />
                              </button>
                              <a
                                href={`mailto:${activeProject.managerEmail}?subject=Regarding Project Milestone ID: ${milestone.id}`}
                                className="px-4 py-2 bg-white/65 hover:bg-white text-foreground border border-white/80 text-xs font-semibold rounded-full transition-all"
                              >
                                Request Revisions
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Building2, User, Mail, Phone, FileText, ChevronLeft } from 'lucide-react';
import { ProjectInquiry, SoftwareType } from '../types';

interface InquiryFormProps {
  onNext: (inquiry: ProjectInquiry) => void;
  onBackToHome: () => void;
}

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

const TIMELINES = [
  'Urgent (Less than 1 month)',
  '1 to 3 months',
  '3 to 6 months',
  'Flexible / Not sure',
];

const MARKETING_CHANNELS = [
  'Google / Search Engine',
  'LinkedIn',
  'Instagram',
  'WhatsApp',
  'Referral / Word of Mouth',
  'Other',
];

export default function InquiryForm({ onNext, onBackToHome }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectTitle: '',
    problemDescription: '',
    softwareType: 'not-sure' as SoftwareType,
    budgetRange: BUDGET_RANGES[1],
    timeline: TIMELINES[1],
    marketingChannel: MARKETING_CHANNELS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
    if (!formData.problemDescription.trim()) newErrors.problemDescription = 'Please describe the problem you want to solve';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const inquiry: ProjectInquiry = {
        ...formData,
        id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
        submittedAt: new Date().toISOString(),
      };
      
      // Persist to mruka_inquiries list for Agency Dashboard visibility
      try {
        const inquiriesList = JSON.parse(localStorage.getItem('mruka_inquiries') || '[]');
        inquiriesList.unshift(inquiry);
        localStorage.setItem('mruka_inquiries', JSON.stringify(inquiriesList));
      } catch (err) {
        console.error('Failed to store inquiry in local storage', err);
      }

      onNext(inquiry);
    }
  };

  const selectSoftwareType = (type: SoftwareType) => {
    setFormData((prev) => ({ ...prev, softwareType: type }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-16">
      {/* Navigation and Back button */}
      <button 
        onClick={onBackToHome}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-medium transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Back to Home
      </button>

      {/* Progress Indicator */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/60">
          <span className="h-2 w-2 rounded-full bg-[#AFCFB5] animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Step 1 of 2: Project Blueprint</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-medium text-foreground tracking-tight">
          Tell us about your project
        </h1>
        <p className="mt-2 text-sm text-foreground/60 font-body max-w-lg mx-auto">
          No jargon required. Just describe what you want to build and let us handle the engineering.
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="soft-glass rounded-[2rem] p-6 md:p-10 border-white/60 space-y-8"
      >
        {/* Contact Info Grid */}
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground/85 mb-4 flex items-center gap-2">
            <User size={18} className="text-[#7AA884]" /> About You & Your Company
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="name">
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-white/50 border ${errors.name ? 'border-red-400' : 'border-white/80'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-body">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="email">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="e.g., jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-white/50 border ${errors.email ? 'border-red-400' : 'border-white/80'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g., +1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="company">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                placeholder="e.g., Acme Innovations"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <hr className="border-white/40" />
        
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground/85 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[#7AA884]" /> The Project Concept
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="projectTitle">
                Project Title / Idea *
              </label>
              <input
                id="projectTitle"
                type="text"
                placeholder="e.g., On-demand cleaning service app"
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                className={`w-full bg-white/50 border ${errors.projectTitle ? 'border-red-400' : 'border-white/80'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground`}
              />
              {errors.projectTitle && <p className="text-red-500 text-xs mt-1 font-body">{errors.projectTitle}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="problemDescription">
                What problem should this software solve? *
              </label>
              <textarea
                id="problemDescription"
                rows={4}
                placeholder="Describe what bottlenecks, pain points, or needs this project addresses. Write in plain English."
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                className={`w-full bg-white/50 border ${errors.problemDescription ? 'border-red-400' : 'border-white/80'} rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground resize-none`}
              />
              {errors.problemDescription && <p className="text-red-500 text-xs mt-1 font-body">{errors.problemDescription}</p>}
            </div>
          </div>
        </div>

        {/* Software Type Selector */}
        <hr className="border-white/40" />

        <div>
          <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-3">
            What are we building?
          </label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { type: 'mobile', label: 'Mobile App' },
              { type: 'website', label: 'Website / Landing Page' },
              { type: 'webapp', label: 'Web Platform / SaaS' },
              { type: 'desktop', label: 'Desktop Tool / Automation' },
              { type: 'not-sure', label: 'Not Sure / Need Consultation' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => selectSoftwareType(item.type as SoftwareType)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  formData.softwareType === item.type 
                    ? 'bg-[#2D3A31] text-white border-transparent shadow-sm'
                    : 'bg-white/40 text-foreground/80 border-white/60 hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget, Timeline & Acquisition */}
        <hr className="border-white/40" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="budget">
              Approx. Budget Range
            </label>
            <select
              id="budget"
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground"
            >
              {BUDGET_RANGES.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="timeline">
              Target Timeline
            </label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground"
            >
              {TIMELINES.map(timeline => (
                <option key={timeline} value={timeline}>{timeline}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="channel">
              How did you find us?
            </label>
            <select
              id="channel"
              value={formData.marketingChannel}
              onChange={(e) => setFormData({ ...formData, marketingChannel: e.target.value })}
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFCFB5]/40 transition-all font-body text-foreground"
            >
              {MARKETING_CHANNELS.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-foreground/50 font-body text-center md:text-left flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#AFCFB5]" /> Fully secure submission. We respect your confidentiality.
          </p>
          <button
            type="submit"
            className="w-full md:w-auto bg-[#2D3A31] text-white rounded-full px-8 py-3.5 text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] transform"
          >
            Next: Book your call <ArrowRight size={16} />
          </button>
        </div>
      </motion.form>
    </div>
  );
}

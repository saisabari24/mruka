import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Video, Phone, MapPin, Calendar as CalendarIcon, Clock, Sparkles, Check } from 'lucide-react';
import { ProjectInquiry, BookingDetails, MeetingType } from '../types';

interface CalendarBookingProps {
  inquiry: ProjectInquiry | null;
  onConfirm: (booking: BookingDetails) => void;
  onSkip: () => void;
}

const TIME_SLOTS = [
  { id: '1', time: '09:00 AM', period: 'morning', available: true },
  { id: '2', time: '10:00 AM', period: 'morning', available: true },
  { id: '3', time: '11:00 AM', period: 'morning', available: false },
  { id: '4', time: '01:00 PM', period: 'afternoon', available: true },
  { id: '5', time: '02:30 PM', period: 'afternoon', available: true },
  { id: '6', time: '04:00 PM', period: 'afternoon', available: false },
  { id: '7', time: '05:00 PM', period: 'afternoon', available: true },
];

export default function CalendarBooking({ inquiry, onConfirm, onSkip }: CalendarBookingProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>('video');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const isDateSelectable = (dayNum: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(year, month, dayNum);
    
    // Grey out past dates and weekends (0 = Sunday, 6 = Saturday)
    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return targetDate >= today && !isWeekend;
  };

  const handleDateClick = (dayNum: number) => {
    if (!isDateSelectable(dayNum)) return;
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    setSelectedDate(`${year}-${formattedMonth}-${formattedDay}`);
    setSelectedSlot(null); // Reset slot when day changes
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    setIsSubmitting(true);
    
    // Simulate API booking
    setTimeout(() => {
      const code = 'MRK-' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(code);
      setIsSubmitting(false);
      setIsCompleted(true);
      
      const booking: BookingDetails = {
        id: 'BKG-' + Math.floor(1000 + Math.random() * 9000),
        inquiryId: inquiry?.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        meetingType,
        bookedAt: new Date().toISOString()
      };
      
      // Store in localStorage so the user can actually track it in the ProjectTracker dashboard
      const mockProject = {
        id: code,
        name: inquiry?.projectTitle || 'Product Design & Development',
        company: inquiry?.company || inquiry?.name || 'Self',
        status: 'Pending Approval',
        milestonesCompleted: 1,
        totalMilestones: 4,
        daysRemaining: 14,
        managerName: 'Elena Vasileva',
        managerEmail: 'elena@mruka.agency',
        projectHealth: 'Healthy',
        progressPercentage: 25,
        milestones: [
          {
            id: 'm1',
            name: 'Initial Consultation Scheduled',
            description: `Discovery call scheduled on ${selectedDate} at ${selectedSlot} via ${meetingType === 'video' ? 'Google Meet' : meetingType}.`,
            status: 'Completed',
            dueDate: selectedDate,
          },
          {
            id: 'm2',
            name: 'Inquiry Blueprint Review',
            description: `The engineering team reviews your project specifications: "${inquiry?.problemDescription || 'Custom Blueprint'}".`,
            status: 'In Progress',
            dueDate: new Date(new Date(selectedDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            requiresClientAction: true,
            clientActionLabel: 'Prepare project reference docs'
          },
          {
            id: 'm3',
            name: 'Proposal & Scope Definition',
            description: 'Delivery of detailed proposal, timeline, fixed milestones and budget allocation.',
            status: 'Pending',
            dueDate: new Date(new Date(selectedDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
          {
            id: 'm4',
            name: 'Kickoff and Implementation',
            description: 'Initial architectural framework and frontend designs set up in development stage.',
            status: 'Pending',
            dueDate: new Date(new Date(selectedDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
        ]
      };
      
      localStorage.setItem(`project_${code}`, JSON.stringify(mockProject));
      localStorage.setItem('active_project_code', code);
      
      // Persist to central mruka_bookings list for Agency Portal
      try {
        const bookingsList = JSON.parse(localStorage.getItem('mruka_bookings') || '[]');
        const fullBooking = {
          ...booking,
          projectCode: code,
          clientName: inquiry?.name || 'Self',
          clientEmail: inquiry?.email || '',
          clientCompany: inquiry?.company || 'Self',
          projectTitle: inquiry?.projectTitle || 'Product Design & Development'
        };
        bookingsList.unshift(fullBooking);
        localStorage.setItem('mruka_bookings', JSON.stringify(bookingsList));
      } catch (err) {
        console.error('Failed to store booking in local storage', err);
      }
      
      onConfirm(booking);
    }, 1500);
  };

  const getDayClass = (dayNum: number) => {
    const isSelectable = isDateSelectable(dayNum);
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const isSelected = selectedDate === dateStr;

    if (!isSelectable) {
      return 'text-foreground/20 cursor-not-allowed bg-transparent font-light';
    }
    if (isSelected) {
      return 'bg-[#2D3A31] text-white font-semibold shadow-sm rounded-full scale-105 transform';
    }
    return 'bg-white/40 text-foreground hover:bg-[#AFCFB5]/20 font-medium rounded-full cursor-pointer';
  };

  const formatDateLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="booking-flow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/60">
                <span className="h-2 w-2 rounded-full bg-[#AFCFB5] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Step 2 of 2: Discover Session</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-medium text-foreground tracking-tight">
                Secure your consultation
              </h1>
              <p className="mt-2 text-sm text-foreground/60 font-body max-w-lg mx-auto">
                Select a slot directly from our calendar to speak with an engineering specialist. No back-and-forth emails.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Calendar Column (Left) */}
              <div className="lg:col-span-7 soft-glass rounded-[2rem] p-6 border-white/60 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-white/20">
                  <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                    <CalendarIcon size={18} className="text-[#7AA884]" /> {monthNames[month]} {year}
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-foreground/80 transition-all border border-white/80"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-foreground/80 transition-all border border-white/80"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="text-[10px] font-bold uppercase tracking-wider text-foreground/45 py-2">
                      {d}
                    </div>
                  ))}

                  {/* Empty offsets for calendar layout */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`offset-${i}`} className="aspect-square"></div>
                  ))}

                  {/* Month Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => handleDateClick(dayNum)}
                        className={`aspect-square flex items-center justify-center text-sm transition-all ${getDayClass(dayNum)}`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots and Options (Right) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Time Slots */}
                <div className="soft-glass rounded-[2rem] p-6 border-white/60 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-[#7AA884]" /> Available Slots
                  </h2>
                  
                  {selectedDate ? (
                    <div className="space-y-4">
                      <p className="text-xs text-foreground/60 font-body">
                        Showing slots for <span className="font-semibold text-foreground">{formatDateLabel(selectedDate)}</span>
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition-all flex justify-between items-center ${
                              !slot.available 
                                ? 'bg-transparent text-foreground/20 border-white/20 line-through cursor-not-allowed'
                                : selectedSlot === slot.time
                                  ? 'bg-[#2D3A31] text-white border-transparent shadow-sm scale-[1.02] transform'
                                  : 'bg-white/40 text-foreground/80 border-white/60 hover:bg-white/60'
                            }`}
                          >
                            <span>{slot.time}</span>
                            <span className="opacity-60 font-normal uppercase text-[9px] tracking-wider">
                              {slot.period === 'morning' ? 'AM' : 'PM'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <CalendarIcon size={28} className="mx-auto text-foreground/30 animate-bounce" />
                      <p className="text-xs text-foreground/50 font-body">Please select a date from the calendar to view available slots.</p>
                    </div>
                  )}
                </div>

                {/* Meeting Type Selection */}
                <div className="soft-glass rounded-[2rem] p-6 border-white/60 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Meeting Medium</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'video', label: 'Google Meet', icon: Video },
                      { type: 'phone', label: 'Phone Call', icon: Phone },
                      { type: 'in-person', label: 'In-Person', icon: MapPin },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setMeetingType(item.type as MeetingType)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                            meetingType === item.type
                              ? 'bg-[#2D3A31]/5 border-[#2D3A31] text-[#2D3A31]'
                              : 'bg-white/40 border-white/60 text-foreground/60 hover:bg-white/60'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[10px] font-semibold leading-none">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions and Skip Options */}
            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={onSkip}
                className="text-xs font-semibold text-foreground/60 hover:text-foreground underline transition-colors"
              >
                Skip scheduling, follow up with me manually
              </button>
              
              <p className="text-[11px] text-foreground/50 font-body text-center max-w-sm">
                Meetings are scheduled instantly. Check your email directly post-booking for links and calendar invites.
              </p>
            </div>

            {/* Slide-Up Confirmation Bar */}
            <AnimatePresence>
              {selectedDate && selectedSlot && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-[600px] soft-glass-strong rounded-[2rem] p-6 shadow-2xl border-white/80 flex flex-col sm:flex-row justify-between items-center gap-4 z-50"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="h-10 w-10 rounded-xl bg-[#AFCFB5]/20 flex items-center justify-center text-[#7AA884]">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground leading-tight">Confirm Discovery Session</h4>
                      <p className="text-xs text-foreground/60 font-body mt-0.5">
                        {formatDateLabel(selectedDate)} at {selectedSlot} • {meetingType === 'video' ? 'Google Meet' : meetingType}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#2D3A31] text-white rounded-full px-6 py-3 text-xs font-semibold hover:bg-[#2D3A31]/90 shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                    ) : (
                      <>Confirm booking <Check size={14} /></>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Post-Booking Success Dashboard */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl mx-auto text-center soft-glass rounded-[2rem] p-8 md:p-12 border-white/60 space-y-8"
          >
            <div className="h-16 w-16 bg-[#AFCFB5]/20 text-[#7AA884] rounded-full flex items-center justify-center mx-auto scale-110">
              <Check size={32} />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-heading font-medium tracking-tight">Booking Confirmed!</h1>
              <p className="text-sm text-foreground/60 font-body leading-relaxed max-w-md mx-auto">
                We've scheduled your discovery call for <strong className="text-foreground">{selectedDate ? formatDateLabel(selectedDate) : ''} at {selectedSlot}</strong>. Check your inbox for the calendar invite and meeting details.
              </p>
            </div>

            {/* Generated Code Portal Banner */}
            <div className="bg-white/40 border border-white/60 rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Your Project ID</span>
                <span className="px-2.5 py-0.5 bg-[#AFCFB5]/25 text-[#2D3A31] text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <code className="text-2xl font-mono font-bold tracking-wider text-[#2D3A31]">
                  {generatedCode}
                </code>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Track Live</span>
                </div>
              </div>
              <p className="text-[11px] text-foreground/60 font-body leading-relaxed border-t border-white/40 pt-3">
                Save this unique project code! You can use it anytime via our **Project Tracker** page in the main navigation to see design approvals, active milestones, and build progress.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onSkip} // Simply proceed to project tracker dashboard
                className="w-full bg-[#2D3A31] text-white rounded-full py-3.5 text-xs font-semibold hover:bg-[#2D3A31]/90 shadow-md transition-all hover:scale-[1.01] transform"
              >
                Go to Project Tracker
              </button>
              <button
                onClick={onSkip} // Reset back to home screen
                className="w-full bg-white/40 text-foreground border border-white/60 rounded-full py-3.5 text-xs font-semibold hover:bg-white/60 transition-all"
              >
                Back to main site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

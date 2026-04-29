import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Smartphone, Layout, Cpu, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-[#F7F9F7] relative min-h-screen font-body text-foreground selection:bg-primary/30 selection:text-foreground">
      <div className="gradient-blob blob-primary" />
      <div className="gradient-blob blob-secondary" />

      {/* NAVBAR */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-6 lg:px-12 flex justify-center">
        <div className="w-full max-w-5xl soft-glass rounded-full px-6 md:px-8 py-3 flex justify-between items-center relative z-50">
          <a href="#home" className="flex items-center text-[#9AB8A0]">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Mruka" 
                className="h-8 md:h-10 w-auto" 
                onError={() => setLogoError(true)} 
              />
            ) : (
              <div 
                className="font-heading text-3xl font-medium tracking-tight text-foreground" 
                style={{ fontVariantLigatures: 'common-ligatures' }}
              >
                mruka
              </div>
            )}
          </a>
          
          <div className="hidden md:flex gap-8">
            <a href="#services" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Services</a>
            <a href="#work" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Work</a>
            <a href="#ai" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">AI Solutions</a>
            <a href="#about" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">About</a>
          </div>

          <div className="hidden md:block">
            <a href="#contact" className="bg-[#2D3A31] text-white rounded-full px-6 py-2.5 text-sm font-semibold font-body shadow-sm hover:bg-[#2D3A31]/90 transition-all inline-block">
              Get a Quote
            </a>
          </div>

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-6 right-6 soft-glass rounded-2xl p-4 flex flex-col gap-4 shadow-lg md:hidden z-40"
            >
              <a href="#services" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#work" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
              <a href="#ai" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>AI Solutions</a>
              <a href="#about" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#contact" className="bg-foreground text-white rounded-full px-5 py-3 text-sm font-semibold text-center mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                Get a Quote
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-[90vh] overflow-hidden flex items-center pt-20 pb-12">
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="soft-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#AFCFB5]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Digital Innovation Agency</span>
          </motion.div>

          <motion.h1 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-6xl font-heading font-medium text-foreground leading-[1.05] tracking-tight max-w-4xl"
          >
            Build the future of your <br className="hidden md:block" />
            <span className="text-[#7AA884]">business.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-lg opacity-60 font-body max-w-2xl mx-auto leading-relaxed text-foreground"
          >
            App and website development, coupled with AI-driven automation for enhanced, effortless business processes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-4"
          >
            <a href="#contact" className="soft-glass-strong rounded-full px-10 py-4 text-foreground font-heading text-base font-semibold hover:scale-[1.02] transition-transform inline-block">
              Start Your Project
            </a>
            <a href="#services" className="text-foreground font-body font-semibold px-8 py-4 hover:opacity-80 transition-opacity inline-block">
              Explore Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="soft-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AFCFB5]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Our Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-foreground font-medium tracking-tight">Everything you need to scale.</h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="soft-glass rounded-[2rem] p-6 text-left border-white/40 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center mb-4 text-[#AFCFB5]">
               <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Custom Apps</h3>
            <p className="text-sm opacity-60 font-body leading-relaxed text-foreground">
              Native and cross-platform mobile experiences designed for conversion and retention.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="soft-glass rounded-[2rem] p-6 text-left border-white/40 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center mb-4 text-[#AFCFB5]">
               <Layout className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Web Platforms</h3>
            <p className="text-sm opacity-60 font-body leading-relaxed text-foreground">
              Modern, high-performance websites and web apps built for speed and seamless UX.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="soft-glass rounded-[2rem] p-6 text-left border-white/40 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center mb-4 text-[#AFCFB5]">
               <Cpu className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">AI Workflows</h3>
            <p className="text-sm opacity-60 font-body leading-relaxed text-foreground">
              Intelligent automation and AI integrations that eliminate manual tasks and optimize business operations.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* AI & AUTOMATION SHOWCASE */}
      <section id="ai" className="py-24 bg-white/50 relative z-10">
        <div className="px-6 md:px-12 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-heading font-medium leading-tight text-foreground tracking-tight">
              Work smarter, not harder <br className="hidden lg:block"/>with AI.
            </h2>
            <p className="mt-6 text-lg opacity-60 font-body leading-relaxed text-foreground">
              We don't just build software; we engineer efficiency. Our custom AI agents and automated pipelines reduce operational overhead so your team can focus on growth.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Automated customer support",
                "Data-driven business insights",
                "Seamless software integrations"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#AFCFB5] h-5 w-5" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="mt-10 bg-[#2D3A31] text-white rounded-full px-8 py-3.5 font-heading text-sm font-semibold inline-block hover:bg-[#2D3A31]/90 transition-colors shadow-sm">
              Discover AI Solutions
            </a>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="soft-glass rounded-[2rem] p-4 relative overflow-hidden aspect-square flex items-center justify-center bg-gradient-to-br from-[#AFCFB5]/10 to-[#F2E9E1]/20 border-white/40">
              {/* Decorative AI Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-48 h-28 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 top-[15%] left-[10%] p-4 flex flex-col justify-center"
              >
                <div className="h-2.5 w-16 bg-primary/40 rounded-full mb-4"></div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-muted rounded-full"></div>
                  <div className="h-2 w-4/5 bg-muted rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute w-56 h-40 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 bottom-[15%] right-[5%] p-5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-end h-16 gap-2">
                  {[40, 70, 45, 90, 60, 80].map((h, i) => (
                    <div key={i} className="w-full bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted">
                    <div className="w-6 h-6 rounded-full bg-secondary/80"></div>
                    <div className="h-2 w-20 bg-muted rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-full border border-primary/30 flex items-center justify-center z-10 bg-white/20 backdrop-blur-sm"
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Cpu className="text-primary w-10 h-10" />
                </div>
              </motion.div>

              {/* Connecting Lines (Svg) */}
              <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-40">
                <path d="M 50 150 Q 200 250 350 150 T 500 350" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/50" strokeDasharray="4 4" />
                <path d="M 100 350 Q 250 150 400 250 T 550 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary/50" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* WORK SHOWCASE */}
      <section id="work" className="py-24 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="soft-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AFCFB5]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Featured Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-foreground font-medium tracking-tight">Our recent successes.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Fintech Dashboard UI",
              desc: "A sleek, intuitive dashboard for a leading fintech startup, focusing on data visualization.",
              tags: ["React", "Tailwind", "D3.js"]
            },
            {
              title: "E-Commerce Mobile App",
              desc: "Cross-platform mobile application built for maximum conversion and speed.",
              tags: ["React Native", "Node.js", "Stripe"]
            },
            {
              title: "AI Support Agent",
              desc: "Automated customer support AI that reduced response times by 80%.",
              tags: ["OpenAI", "Python", "AWS"]
            },
            {
              title: "Healthcare CRM",
              desc: "Secure patient management system with automated scheduling and reminders.",
              tags: ["Next.js", "PostgreSQL", "HIPAA"]
            }
          ].map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="soft-glass rounded-[2rem] overflow-hidden group cursor-pointer border-white/40"
            >
              <div className="h-48 bg-gradient-to-br from-[#AFCFB5]/20 to-[#F2E9E1]/30 relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-full p-6 flex flex-col">
                  {/* Abstract UI representation */}
                  <div className="flex gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-foreground/20"></div>
                    <div className="h-3 w-3 rounded-full bg-foreground/20"></div>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 w-full group-hover:scale-105 transition-transform duration-500 ease-out"></div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">{project.title}</h3>
                <p className="text-foreground/60 font-body mb-6 text-sm leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#2D3A31]/5 text-foreground rounded-full border border-foreground/10">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-foreground text-background relative z-10 rounded-[3rem] mx-4 md:mx-12 overflow-hidden">
        <div className="gradient-blob blob-primary opacity-20" style={{ background: '#AFCFB5' }} />
        <div className="px-6 md:px-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block rounded-full px-4 py-1.5 border border-background/20 bg-background/5 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AFCFB5]">About Mruka</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-6">
              Bridging design and intelligence.
            </h2>
            <p className="text-background/70 font-body text-lg leading-relaxed mb-6">
              We are a team of engineers, designers, and AI specialists united by a single goal: creating digital experiences that push boundaries.
            </p>
            <p className="text-background/70 font-body text-lg leading-relaxed">
              Based at the intersection of technology and creativity, Mruka builds solutions that don't just look beautiful, but actively drive business forward through intelligent automation.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-4xl font-heading text-[#7AA884] mb-2">50+</h4>
                <p className="text-sm font-body text-background/60">Projects Delivered</p>
              </div>
              <div>
                <h4 className="text-4xl font-heading text-[#7AA884] mb-2">99%</h4>
                <p className="text-sm font-body text-background/60">Client Satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full flex flex-col gap-4">
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-background/10 backdrop-blur-md rounded-3xl p-8 border border-white/10"
            >
              <h3 className="font-heading text-xl mb-2">Design-Led Polish</h3>
              <p className="font-body text-sm text-background/70 leading-relaxed">Every pixel is placed with intention, ensuring your brand stands out in a crowded digital landscape.</p>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 ml-0 md:ml-8"
            >
              <h3 className="font-heading text-xl mb-2">Engineering Excellence</h3>
              <p className="font-body text-sm text-background/70 leading-relaxed">Robust architectures that scale with your growth, ensuring zero downtime and lightning-fast performance.</p>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 ml-0 md:ml-16"
            >
              <h3 className="font-heading text-xl mb-2">Future-Proof Innovation</h3>
              <p className="font-body text-sm text-background/70 leading-relaxed">Integrating the latest AI models to automate workflows, giving you an unfair advantage over competitors.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA + FOOTER */}
      <section id="contact" className="pt-24 pb-16 px-6 md:px-12 relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#AFCFB5]/10 -z-10" />

        <div className="max-w-4xl mx-auto text-center soft-glass-strong rounded-[2rem] p-12 md:p-16 border-white/40">
          <h2 className="text-4xl md:text-5xl font-heading font-medium text-foreground mb-6 tracking-tight">
            Ready to optimize <br />your processes?
          </h2>
          <p className="opacity-80 font-body mb-10 text-lg max-w-xl mx-auto leading-relaxed text-foreground">
            Get a free audit of your current digital infrastructure and discover how Mruka can elevate your business.
          </p>
          <a href="mailto:hello@mruka.agency" className="bg-[#2D3A31] text-white rounded-full px-8 py-3.5 font-heading text-sm font-semibold hover:shadow-lg transition-all inline-block hover:scale-[1.02] transform">
            Get in Touch
          </a>
        </div>

        <footer className="mt-24 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium opacity-40 uppercase tracking-widest text-foreground">
          <div>© 2026 Mruka Digital.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Twitter</a>
          </div>
        </footer>
      </section>
    </div>
  );
}

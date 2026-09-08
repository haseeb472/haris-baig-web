'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Palette,
  Gamepad2,
  Inbox,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  Download,
  AlertCircle,
  Database,
  Sparkles,
  Users,
  Lock,
  LogOut,
  Layers,
  Upload
} from 'lucide-react';
import { Service, Project, Lead, SiteSettings, DatabaseSchema } from '@/lib/cms';
import confetti from 'canvas-confetti';

type Tab = 'dashboard' | 'services' | 'projects' | 'leads' | 'settings' | 'newsletter' | 'pages';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [warning, setWarning] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setWarning('');
    
    // Check size limit: max 250kb (256000 bytes)
    const limitBytes = 250 * 1024;
    if (file.size > limitBytes) {
      setWarning(`Image size is too large (${(file.size / 1024).toFixed(1)} KB). Max allowed size is 250 KB.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setWarning(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      setWarning('Network upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
        {label}
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
          dragActive 
            ? 'border-neon-cyan bg-neon-cyan/5' 
            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {value ? (
          <div className="flex items-center gap-4 w-full relative z-20 pointer-events-none text-left">
            {/* Thumbnail Preview */}
            <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-black flex-shrink-0">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white truncate font-mono">{value}</p>
              <p className="text-[9px] text-gray-500">Drag or click to replace</p>
            </div>
          </div>
        ) : (
          <div className="text-center pointer-events-none">
            <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1.5" />
            <p className="text-[10px] text-gray-300 font-bold">Drag & Drop Image</p>
            <p className="text-[8px] text-gray-500 mt-0.5">Or click to select (Max 250KB)</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center z-30">
            <span className="text-[10px] text-white font-bold animate-pulse">Uploading...</span>
          </div>
        )}
      </div>

      {warning && (
        <p className="text-[9px] text-red-400 font-bold leading-normal bg-red-500/5 border border-red-500/10 p-2 rounded-lg text-left">
          ⚠️ {warning}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Security PIN Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('logicforge_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleKeyPress = (num: string) => {
    if (enteredPin.length >= 4) return;
    setPinError('');
    const newPin = enteredPin + num;
    setEnteredPin(newPin);

    // Validate 4-digit PIN immediately
    if (newPin.length === 4) {
      if (newPin === '1992') {
        sessionStorage.setItem('logicforge_admin_auth', 'true');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 300);
      } else {
        setIsShaking(true);
        setPinError('Access Denied. Invalid PIN Code.');
        setTimeout(() => {
          setIsShaking(false);
          setEnteredPin('');
        }, 600);
      }
    }
  };

  const handleBackspace = () => {
    setPinError('');
    setEnteredPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinError('');
    setEnteredPin('');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to lock the console and log out?')) {
      sessionStorage.removeItem('logicforge_admin_auth');
      setIsAuthenticated(false);
      setEnteredPin('');
      setPinError('');
    }
  };

  useEffect(() => {
    if (isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enteredPin, isAuthenticated]);
  
  // Database States
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newsletter, setNewsletter] = useState<{ email: string; date: string }[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Pages Builder States
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [currentCompContent, setCurrentCompContent] = useState<any>({});
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);

  // Edit / Form States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Modal / Editor triggers
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState<any>({});
  const [currentProject, setCurrentProject] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load all tables
      const resServices = await fetch('/api/cms?table=services');
      const resProjects = await fetch('/api/cms?table=projects');
      const resLeads = await fetch('/api/cms?table=leads');
      const resNews = await fetch('/api/cms?table=newsletter');
      const resPages = await fetch('/api/cms?table=pages');
      
      const dbServices = await resServices.json();
      const dbProjects = await resProjects.json();
      const dbLeads = await resLeads.json();
      const dbNews = await resNews.json();
      const dbPages = await resPages.json();

      setServices(dbServices || []);
      setProjects(dbProjects || []);
      // Sort leads by date descending
      setLeads((dbLeads || []).sort((a: Lead, b: Lead) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setNewsletter(dbNews || []);
      setPages(dbPages || []);
      
      // Settings load
      const resSet = await fetch('/api/cms?table=settings');
      const dbSet = await resSet.json();
      setSettings(dbSet);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch CMS tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms?table=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      setError('Save error.');
    } finally {
      setSaving(false);
    }
  };

  // Lead update (resolving submission inquiries)
  const handleResolveLead = async (leadId: string, status: 'contacted' | 'resolved') => {
    try {
      const res = await fetch(`/api/cms?table=leads&id=${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete generic helper
  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/cms?table=${table}&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      setError('Delete failure.');
    }
  };

  // --- PAGES BUILDER HANDLERS ---

  const handleSavePages = async (updatedPagesList: any[]) => {
    setSaving(true);
    try {
      const changedPage = updatedPagesList.find(p => p.id === selectedPageId);
      if (!changedPage) return false;

      const res = await fetch(`/api/cms?table=pages&id=${selectedPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedPage)
      });
      
      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving page layouts:', err);
      setError('Failed to sync page layout changes.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleMoveComponent = async (pageId: string, compIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...pages];
    const pageIndex = updatedPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const comps = [...updatedPages[pageIndex].components];
    const targetIndex = direction === 'up' ? compIndex - 1 : compIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= comps.length) return;

    const temp = comps[compIndex];
    comps[compIndex] = comps[targetIndex];
    comps[targetIndex] = temp;

    updatedPages[pageIndex].components = comps;
    setPages(updatedPages);
    
    await handleSavePages(updatedPages);
  };

  const handleToggleComponent = async (pageId: string, compId: string) => {
    const updatedPages = [...pages];
    const pageIndex = updatedPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const comps = updatedPages[pageIndex].components.map((c: any) => 
      c.id === compId ? { ...c, enabled: !c.enabled } : c
    );

    updatedPages[pageIndex].components = comps;
    setPages(updatedPages);

    await handleSavePages(updatedPages);
  };

  const handleDeleteComponent = async (pageId: string, compId: string) => {
    if (!confirm("Are you sure you want to delete this component from this page?")) return;
    
    const updatedPages = [...pages];
    const pageIndex = updatedPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const comps = updatedPages[pageIndex].components.filter((c: any) => c.id !== compId);
    
    updatedPages[pageIndex].components = comps;
    setPages(updatedPages);

    await handleSavePages(updatedPages);
  };

  const handleAddComponent = async (pageId: string, type: string) => {
    const updatedPages = [...pages];
    const pageIndex = updatedPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const newComp = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      title: type.replace(/([A-Z])/g, ' $1').trim(),
      enabled: true,
      content: {}
    };

    updatedPages[pageIndex].components.push(newComp);
    setPages(updatedPages);

    await handleSavePages(updatedPages);
    setShowAddComponentModal(false);
  };

  const handleSaveCompContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompId) return;

    const updatedPages = [...pages];
    const pageIndex = updatedPages.findIndex(p => p.id === selectedPageId);
    if (pageIndex === -1) return;

    const comps = updatedPages[pageIndex].components.map((c: any) => 
      c.id === editingCompId ? { ...c, content: currentCompContent } : c
    );

    updatedPages[pageIndex].components = comps;
    setPages(updatedPages);

    const success = await handleSavePages(updatedPages);
    if (success) {
      setEditingCompId(null);
      confetti({ particleCount: 30, spread: 40 });
    }
  };

  // --- CRUD WRITES ---

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId && editingId !== 'new' ? 'PUT' : 'POST';
      const url = editingId && editingId !== 'new' ? `/api/cms?table=projects&id=${editingId}` : '/api/cms?table=projects';
      
      const payload = {
        name: currentProject.name || 'New Project',
        slug: currentProject.slug || 'new-project',
        category: currentProject.category || 'art-animation',
        description: currentProject.description || '',
        client: currentProject.client || '',
        year: currentProject.year || '2026',
        image: currentProject.image || '',
        video: currentProject.video || '',
        tags: Array.isArray(currentProject.tags) ? currentProject.tags : typeof currentProject.tags === 'string' ? (currentProject.tags as string).split(',').map((t) => t.trim()) : [],
        stats: currentProject.stats || ''
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingId(null);
        setCurrentProject({});
        await fetchData();
        confetti({ particleCount: 50 });
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || `Failed to save project (status ${res.status})`);
      }
    } catch (err) {
      setError('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId && editingId !== 'new' ? 'PUT' : 'POST';
      const url = editingId && editingId !== 'new' ? `/api/cms?table=services&id=${editingId}` : '/api/cms?table=services';

      const payload = {
        name: currentService.name || 'New Service',
        slug: currentService.slug || 'new-service',
        category: currentService.category || 'art-animation',
        description: currentService.description || '',
        icon: currentService.icon || 'Cpu',
        benefits: Array.isArray(currentService.benefits) ? currentService.benefits : typeof currentService.benefits === 'string' ? (currentService.benefits as string).split(',').map((t) => t.trim()) : [],
        process: Array.isArray(currentService.process) ? currentService.process : [],
        faqs: Array.isArray(currentService.faqs) ? currentService.faqs : []
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingId(null);
        setCurrentService({});
        fetchData();
        confetti({ particleCount: 50 });
      }
    } catch (err) {
      setError('Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackupDb = () => {
    // Generate a downloadable backup
    const fullDb = { services, projects, blogs: [], team: [], testimonials: [], faqs: [], settings, leads, newsletter };
    const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logicforge-cms-backup-${Date.now()}.json`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 text-foreground font-sans relative overflow-hidden">
        {/* Shaking Custom Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes adminShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
          }
          .admin-shake {
            animation: adminShake 0.5s ease-in-out;
          }
        ` }} />

        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Security Container */}
        <div className={`w-full max-w-md p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl flex flex-col items-center space-y-8 relative z-10 ${isShaking ? 'admin-shake' : ''}`}>
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-purple shadow-[0_0_20px_rgba(139,92,246,0.15)] animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="font-space font-bold text-lg uppercase tracking-wider text-white">LogicForge Security</h1>
              <p className="text-[11px] text-gray-400 max-w-[280px]">Encrypted Terminal. Authorized administrative personnel access only.</p>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isActive = enteredPin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-neon-purple to-neon-blue border-transparent scale-110 shadow-[0_0_12px_rgba(139,92,246,0.6)]' 
                      : 'border-white/10 bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          <div className="h-4 text-center">
            {pinError && (
              <span className="text-xs text-red-500 font-semibold uppercase tracking-wider animate-pulse">
                {pinError}
              </span>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-95 transition-all text-white font-space font-bold text-xl flex items-center justify-center cursor-pointer shadow-sm"
              >
                {num}
              </button>
            ))}
            
            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="w-16 h-16 rounded-full text-xs text-gray-500 hover:text-gray-300 font-bold tracking-wider hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
            >
              Clear
            </button>
            
            {/* 0 Button */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-95 transition-all text-white font-space font-bold text-xl flex items-center justify-center cursor-pointer shadow-sm"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full text-xs text-gray-500 hover:text-gray-300 font-bold tracking-wider hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
            >
              Delete
            </button>
          </div>

          {/* Passcode Hint for review */}
          <div className="pt-2 text-center">
            <span className="text-[10px] text-gray-600 font-medium select-none">
              Passcode Hint: <span className="font-space font-bold text-gray-500">1992</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-foreground flex flex-col lg:flex-row font-sans">
      
      {/* 1. Sidebar glass drawer (Left side) */}
      <aside className="w-full lg:w-64 glass-panel border-r border-white/5 flex flex-col p-6 z-10 gap-8 h-auto lg:h-screen lg:sticky lg:top-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-lg font-space font-bold text-xs">
            CMS
          </span>
          <span className="font-space font-bold text-sm tracking-wider text-white">LogicForge Admin</span>
        </div>

        <nav className="flex-1 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'pages', name: 'Page Builder', icon: Layers },
            { id: 'projects', name: 'Projects', icon: Palette },
            { id: 'services', name: 'Services', icon: Gamepad2 },
            { id: 'leads', name: 'Leads Inbox', icon: Inbox },
            { id: 'settings', name: 'Site Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setEditingId(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap lg:w-full ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.id === 'leads' && leads.filter((l) => l.status === 'new').length > 0 && (
                  <span className="ml-auto bg-neon-cyan text-black font-bold px-1.5 py-0.5 rounded text-[9px] animate-pulse">
                    {leads.filter((l) => l.status === 'new').length}
                  </span>
                )}
              </button>
            );
          })}
          
          {/* Mobile Lock Console Tab */}
          <button
            onClick={handleLogout}
            className="flex lg:hidden items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Console</span>
          </button>
        </nav>

        <div className="hidden lg:block space-y-3 pt-4 border-t border-white/5">
          <button
            onClick={handleBackupDb}
            className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
          >
            <Download className="w-4 h-4 text-neon-cyan" />
            <span>Database Backup</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 bg-red-500/5 transition-all text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Console</span>
          </button>

          <div className="text-[10px] text-gray-600 text-center font-bold pt-1">
            <p>© {new Date().getFullYear()} LogicForge Inc.</p>
            <p className="mt-0.5">LOCAL CMS V1.2</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Dashboard viewport */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto z-0 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-32 space-y-4 flex-col">
            <div className="w-10 h-10 border-2 border-t-neon-purple border-white/10 rounded-full animate-spin" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Syncing Local CMS Tables...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5" />
                <span>{error}</span>
              </div>
            )}

            {/* A. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-space font-black text-white uppercase">Overview Metrics</h1>
                  <p className="text-gray-500 text-xs mt-1">Real-time statistics extracted from your database.</p>
                </div>

                {/* Counters row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-2">
                    <p className="text-3xl font-space font-black text-white">{projects.length}</p>
                    <p className="text-[10px] text-neon-purple uppercase font-bold tracking-widest font-space">Portfolio items</p>
                  </div>
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-2">
                    <p className="text-3xl font-space font-black text-white">{services.length}</p>
                    <p className="text-[10px] text-neon-cyan uppercase font-bold tracking-widest font-space">Active Services</p>
                  </div>
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-2">
                    <p className="text-3xl font-space font-black text-white">{leads.length}</p>
                    <p className="text-[10px] text-neon-cyan uppercase font-bold tracking-widest font-space">Form Leads Received</p>
                  </div>
                </div>

                {/* Recent Leads display */}
                <div className="space-y-4">
                  <h3 className="font-space font-extrabold text-lg text-white uppercase">Recent Submissions Inbox</h3>
                  <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/3 border-b border-white/5 text-gray-400 uppercase font-semibold">
                          <th className="p-4">Contact</th>
                          <th className="p-4">Category / Type</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {leads.slice(0, 5).map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/2 text-gray-300">
                            <td className="p-4 font-bold text-white">
                              {lead.name}
                              <span className="block text-[10px] text-gray-500 font-normal mt-0.5">{lead.email}</span>
                            </td>
                            <td className="p-4 capitalize">
                              <span className="px-2 py-0.5 rounded text-[9px] bg-neon-purple/10 border border-neon-purple/20 text-neon-cyan font-bold">
                                {lead.type}
                              </span>
                              <span className="block text-[9px] text-gray-500 mt-1">{lead.serviceCategory}</span>
                            </td>
                            <td className="p-4 max-w-xs truncate">{lead.message}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                lead.status === 'new' ? 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse' :
                                lead.status === 'contacted' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                                'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {lead.status === 'new' && (
                                <button
                                  onClick={() => handleResolveLead(lead.id, 'contacted')}
                                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 text-[10px] cursor-pointer"
                                >
                                  Mark Contacted
                                </button>
                              )}
                              {lead.status !== 'resolved' && (
                                <button
                                  onClick={() => handleResolveLead(lead.id, 'resolved')}
                                  className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] cursor-pointer"
                                >
                                  Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* B. PROJECTS CRUD TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-space font-black text-white uppercase">Portfolio Projects</h1>
                    <p className="text-gray-500 text-xs mt-1">Manage project cards, client descriptions, and metrics.</p>
                  </div>
                  {!editingId && (
                    <button
                      onClick={() => {
                        setEditingId('new');
                        setCurrentProject({ name: '', slug: '', category: 'art-animation', description: '', client: '', year: '2026', image: '', video: '', tags: '', stats: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white text-xs font-bold font-space uppercase flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-4.5 h-4.5" />
                      Add Project
                    </button>
                  )}
                </div>

                {/* Form Editor Modal overlay inside panel */}
                {editingId && (
                  <form onSubmit={handleSaveProject} className="p-6 md:p-8 rounded-3xl glass-panel border border-neon-purple/20 space-y-6">
                    <h3 className="font-space font-bold text-white text-sm uppercase border-b border-white/5 pb-4">
                      {editingId === 'new' ? 'New Project Details' : 'Edit Project Details'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Project Name *</label>
                        <input
                          type="text"
                          required
                          value={currentProject.name || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                          placeholder="e.g. Neo Tokyo 2099"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Slug URL *</label>
                        <input
                          type="text"
                          required
                          value={currentProject.slug || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })}
                          placeholder="e.g. neo-tokyo-2099"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Client *</label>
                        <input
                          type="text"
                          required
                          value={currentProject.client || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}
                          placeholder="e.g. Apex Games"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Year Completed *</label>
                        <input
                          type="text"
                          required
                          value={currentProject.year || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, year: e.target.value })}
                          placeholder="e.g. 2026"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Category Segment</label>
                        <select
                          value={currentProject.category || 'art-animation'}
                          onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all appearance-none cursor-pointer"
                        >
                          <option value="art-animation">Art & Animation</option>
                          <option value="game-development">Game Development</option>
                          <option value="web-development">Web Development</option>
                          <option value="ar-vr">AR / VR solutions</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <ImageUpload
                          value={currentProject.image || ''}
                          onChange={(url) => setCurrentProject({ ...currentProject, image: url })}
                          label="Banner Image *"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">HTML5 video URL (Hover preview)</label>
                        <input
                          type="text"
                          value={currentProject.video || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, video: e.target.value })}
                          placeholder="e.g. https://assets.mixkit.co/videos/preview/mixkit-holding-a-vr-controller-44279-large.mp4"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={currentProject.tags || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, tags: e.target.value })}
                          placeholder="Animation, Unreal Engine, 3D Art"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Performance metric stats (Case studies badge)</label>
                        <input
                          type="text"
                          value={currentProject.stats || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, stats: e.target.value })}
                          placeholder="e.g. 45% Engagement Boost"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Case study narrative description *</label>
                      <textarea
                        required
                        rows={4}
                        value={currentProject.description || ''}
                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                        placeholder="Detailed narrative about assets retopology and production parameters..."
                        className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Project'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Table lists */}
                {!editingId && (
                  <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/3 border-b border-white/5 text-gray-400 uppercase font-semibold">
                          <th className="p-4">Project</th>
                          <th className="p-4">Client / Year</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Tags</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-white/2 text-gray-300">
                            <td className="p-4 font-bold text-white flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }} />
                              {project.name}
                            </td>
                            <td className="p-4">
                              {project.client}
                              <span className="block text-[10px] text-gray-500 font-normal mt-0.5">{project.year}</span>
                            </td>
                            <td className="p-4 capitalize">{project.category.replace('-', ' ')}</td>
                            <td className="p-4 max-w-xs truncate">{project.tags.join(', ')}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingId(project.id);
                                  setCurrentProject(project);
                                }}
                                className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white cursor-pointer inline-flex items-center"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('projects', project.id)}
                                className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer inline-flex items-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* D. LEADS INBOX VIEW */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-space font-black text-white uppercase">Inquiries Inbox</h1>
                  <p className="text-gray-500 text-xs mt-1">Review proposals, schedules, and job application letters.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {leads.length === 0 ? (
                    <div className="py-20 text-center glass-panel rounded-3xl border-dashed">
                      <p className="text-gray-500 text-xs">Your leads inbox is empty.</p>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`p-6 rounded-3xl glass-panel border flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all ${
                          lead.status === 'new' ? 'border-red-500/25 bg-red-500/2' : 'border-white/5'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-space font-extrabold text-sm text-white">{lead.name}</span>
                            <span className="text-[10px] text-gray-500 font-semibold">{lead.email}</span>
                            {lead.phone && <span className="text-[10px] text-gray-500 font-semibold">{lead.phone}</span>}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-neon-purple/10 border border-neon-purple/20 text-neon-cyan font-bold capitalize">
                              {lead.type}
                            </span>
                            {lead.serviceCategory && (
                              <span className="text-[10px] text-gray-400 font-semibold">{lead.serviceCategory}</span>
                            )}
                            <span className="text-[10px] text-gray-600 font-normal">
                              {new Date(lead.date).toLocaleString()}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
                            {lead.message}
                          </div>

                          {lead.resumeUrl && (
                            <div className="text-[10px] text-neon-cyan font-semibold flex items-center gap-1">
                              <span>Attached Candidate File:</span>
                              <span className="text-white hover:underline cursor-pointer">{lead.resumeUrl}</span>
                            </div>
                          )}
                        </div>

                        {/* Status updating actions */}
                        <div className="flex-shrink-0 flex flex-row md:flex-col gap-2 h-fit">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-center border uppercase tracking-wider block mb-2 h-fit w-fit md:w-full ${
                            lead.status === 'new' ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse' :
                            lead.status === 'contacted' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {lead.status}
                          </span>
                          
                          {lead.status !== 'resolved' && (
                            <button
                              onClick={() => handleResolveLead(lead.id, 'resolved')}
                              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Resolve</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete('leads', lead.id)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PAGES BUILDER TAB */}
            {activeTab === 'pages' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-space font-black text-white uppercase">Page Layout Builder</h1>
                    <p className="text-gray-500 text-xs mt-1">Configure layout components, reorder sections, and edit content dynamically.</p>
                  </div>
                </div>

                {/* Page Selector Tabs */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto scrollbar-none">
                  {pages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPageId(p.id);
                        setEditingCompId(null);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border whitespace-nowrap ${
                        selectedPageId === p.id
                          ? 'bg-white text-black border-white shadow-lg'
                          : 'text-gray-400 hover:text-white border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>

                {/* Main Content Layout splits */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Component List */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-space font-extrabold text-sm text-white uppercase tracking-wider">
                          Active Layout Stack ({pages.find((p: any) => p.id === selectedPageId)?.components.length || 0} Sections)
                        </h3>
                        
                        {/* Add Component Action */}
                        <div className="relative">
                          <button
                            onClick={() => setShowAddComponentModal(!showAddComponentModal)}
                            className="px-4 py-2 rounded-xl bg-neon-purple hover:bg-neon-blue text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Component</span>
                          </button>

                          {showAddComponentModal && (
                            <div data-lenis-prevent className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl p-4 z-40 space-y-3">
                              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Available Modules</h4>
                              <div data-lenis-prevent className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none">
                                {[
                                  'HeroSplitReveal',
                                  'StatsBlock',
                                  'HeroGallery',
                                  'ServicesGrid',
                                  'KeyFactsReveal',
                                  'TechMarquee',
                                  'HorizontalGallery',
                                  'IndustriesServed',
                                  'CurvedCarousel3D',
                                  'HomeContact',
                                  'AboutHero',
                                  'AboutValues',
                                  'AboutReverseReveal',
                                  'ContactHero',
                                  'ServicesHero'
                                ].map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => handleAddComponent(selectedPageId, type)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    {type.replace(/([A-Z])/g, ' $1').trim()}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {pages.find((p: any) => p.id === selectedPageId)?.components.length === 0 ? (
                          <div className="py-12 text-center text-gray-500 text-xs border border-dashed border-white/5 rounded-2xl">
                            No active components configured for this page.
                          </div>
                        ) : (
                          pages.find((p: any) => p.id === selectedPageId)?.components.map((comp: any, idx: number) => {
                            const totalComps = pages.find((p: any) => p.id === selectedPageId)?.components.length || 0;
                            return (
                              <div
                                key={comp.id}
                                className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                                  comp.enabled
                                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                                    : 'bg-white/[0.01] border-white/5 opacity-50'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-space text-white font-bold text-sm">{comp.title}</span>
                                    <span className="text-[9px] font-mono text-neon-cyan uppercase tracking-wider px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20">
                                      {comp.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <span>Status: {comp.enabled ? 'Live on Site' : 'Hidden'}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Up / Down Controls */}
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => handleMoveComponent(selectedPageId, idx, 'up')}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    disabled={idx === totalComps - 1}
                                    onClick={() => handleMoveComponent(selectedPageId, idx, 'down')}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                  >
                                    ↓
                                  </button>

                                  {/* Toggle Enabled */}
                                  <button
                                    onClick={() => handleToggleComponent(selectedPageId, comp.id)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                      comp.enabled
                                        ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                                        : 'bg-neon-purple/20 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/30'
                                    }`}
                                  >
                                    {comp.enabled ? 'Disable' : 'Enable'}
                                  </button>

                                  {/* Edit Content */}
                                  {Object.keys(comp.content || {}).length > 0 && (
                                    <button
                                      onClick={() => {
                                        setEditingCompId(comp.id);
                                        setCurrentCompContent({ ...comp.content });
                                      }}
                                      className="px-3 py-2 rounded-xl bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold text-xs transition-all cursor-pointer"
                                    >
                                      Edit Content
                                    </button>
                                  )}

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeleteComponent(selectedPageId, comp.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Content Editor */}
                  <div className="lg:col-span-1">
                    {editingCompId ? (
                      <form
                        onSubmit={handleSaveCompContent}
                        className="glass-panel border border-neon-purple/20 rounded-3xl p-6 md:p-8 space-y-6 sticky top-24"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-space font-extrabold text-sm text-white uppercase tracking-wider">
                              Component Settings
                            </h3>
                            <button
                              type="button"
                              onClick={() => setEditingCompId(null)}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                          <p className="text-gray-500 text-[10px] mt-1 font-bold">
                            Editing: {pages.find((p: any) => p.id === selectedPageId)?.components.find((c: any) => c.id === editingCompId)?.title}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {Object.keys(currentCompContent).map((key) => {
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                            
                            if (Array.isArray(currentCompContent[key])) {
                              const list = currentCompContent[key];
                              return (
                                <div key={key} className="space-y-4 border-t border-white/5 pt-4">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] text-neon-cyan font-bold uppercase tracking-wider block">
                                      {label} ({list.length} Items)
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const template = list[0] ? { ...list[0] } : { title: '', name: '', desc: '', front: '', back: '', width: '', height: '', num: '' };
                                        Object.keys(template).forEach(k => {
                                          template[k] = '';
                                        });
                                        const updatedList = [...list, template];
                                        setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                      }}
                                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white cursor-pointer"
                                    >
                                      + Add Item
                                    </button>
                                  </div>

                                  <div data-lenis-prevent className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                    {list.map((item: any, itemIdx: number) => (
                                      <div key={itemIdx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative group">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedList = list.filter((_: any, idx: number) => idx !== itemIdx);
                                            setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                          }}
                                          className="absolute right-2 top-2 text-gray-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
                                        >
                                          Remove
                                        </button>
                                        <span className="text-[10px] font-space font-bold text-gray-500 block">Item #{itemIdx + 1}</span>

                                        {typeof item === 'object' && item !== null ? (
                                          Object.keys(item).map((itemKey) => {
                                            const itemLabel = itemKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                                            const isTextarea = ['desc', 'description', 'bio'].includes(itemKey.toLowerCase());
                                            const isImageKey = ['image', 'img', 'src', 'front', 'back', 'icon', 'thumbnail', 'cover', 'photo', 'logo', 'banner'].some(term => itemKey.toLowerCase().includes(term));
                                            return (
                                              <div key={itemKey} className="space-y-1">
                                                {isImageKey ? (
                                                  <ImageUpload
                                                    value={item[itemKey] || ''}
                                                    onChange={(url) => {
                                                      const updatedItem = { ...item, [itemKey]: url };
                                                      const updatedList = [...list];
                                                      updatedList[itemIdx] = updatedItem;
                                                      setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                                    }}
                                                    label={itemLabel}
                                                  />
                                                ) : isTextarea ? (
                                                  <>
                                                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                                                      {itemLabel}
                                                    </label>
                                                    <textarea
                                                      rows={2}
                                                      value={item[itemKey] || ''}
                                                      onChange={(e) => {
                                                        const updatedItem = { ...item, [itemKey]: e.target.value };
                                                        const updatedList = [...list];
                                                        updatedList[itemIdx] = updatedItem;
                                                        setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                                      }}
                                                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-neon-purple transition-all resize-none font-sans"
                                                    />
                                                  </>
                                                ) : (
                                                  <>
                                                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                                                      {itemLabel}
                                                    </label>
                                                    <input
                                                      type="text"
                                                      value={item[itemKey] || ''}
                                                      onChange={(e) => {
                                                        const updatedItem = { ...item, [itemKey]: e.target.value };
                                                        const updatedList = [...list];
                                                        updatedList[itemIdx] = updatedItem;
                                                        setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                                      }}
                                                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-neon-purple transition-all font-sans"
                                                    />
                                                  </>
                                                )}
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                              const updatedList = [...list];
                                              updatedList[itemIdx] = e.target.value;
                                              setCurrentCompContent({ ...currentCompContent, [key]: updatedList });
                                            }}
                                            className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-neon-purple transition-all font-sans"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            const isTextarea = ['description', 'subheading', 'excerpt', 'content', 'description1', 'description2'].includes(key.toLowerCase());
                            const isImageKey = ['image', 'img', 'src', 'front', 'back', 'icon', 'thumbnail', 'cover', 'photo', 'logo', 'banner'].some(term => key.toLowerCase().includes(term));
                            
                            return (
                              <div key={key} className="space-y-1">
                                {isImageKey ? (
                                  <ImageUpload
                                    value={currentCompContent[key] || ''}
                                    onChange={(url) => setCurrentCompContent({ ...currentCompContent, [key]: url })}
                                    label={label}
                                  />
                                ) : isTextarea ? (
                                  <>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                      {label}
                                    </label>
                                    <textarea
                                      rows={4}
                                      value={currentCompContent[key]}
                                      onChange={(e) => setCurrentCompContent({ ...currentCompContent, [key]: e.target.value })}
                                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all resize-none font-sans leading-relaxed"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                      {label}
                                    </label>
                                    <input
                                      type="text"
                                      value={currentCompContent[key]}
                                      onChange={(e) => setCurrentCompContent({ ...currentCompContent, [key]: e.target.value })}
                                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all font-sans"
                                    />
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5 gap-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="w-full px-5 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-neon-purple/20"
                          >
                            <Save className="w-4 h-4" />
                            {saving ? 'Syncing Layout...' : 'Update Module'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="glass-panel border border-white/5 rounded-3xl p-6 md:p-8 text-center text-gray-500 text-xs py-24 sticky top-24">
                        Select a component content drawer from the left to edit its text details.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* E. SETTINGS TAB */}
            {activeTab === 'settings' && settings && (
              <form onSubmit={handleSaveSettings} className="p-6 md:p-8 rounded-3xl glass-panel border border-neon-purple/20 space-y-6">
                <div>
                  <h1 className="text-3xl font-space font-black text-white uppercase">Site Configuration</h1>
                  <p className="text-gray-500 text-xs mt-1">Configure site metadata, email, and social networks.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <ImageUpload
                      value={settings.logo || ''}
                      onChange={(url) => setSettings({ ...settings, logo: url })}
                      label="Studio Logo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Studio Name</label>
                    <input
                      type="text"
                      required
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Hotline Support Email</label>
                    <input
                      type="email"
                      required
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Hotline Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Address Locations</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Company brief overview Summary</label>
                  <textarea
                    rows={4}
                    value={settings.aboutSummary}
                    onChange={(e) => setSettings({ ...settings, aboutSummary: e.target.value })}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving Site settings...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-space font-black text-white uppercase">Services Database</h1>
                    <p className="text-gray-500 text-xs mt-1">Manage sub-services, descriptions, custom process steps, and FAQs.</p>
                  </div>
                  {!editingId && (
                    <button
                      onClick={() => {
                        setEditingId('new');
                        setCurrentService({
                          name: '',
                          slug: '',
                          category: 'art-animation',
                          description: '',
                          benefits: '',
                          icon: 'Cpu',
                          process: [{ num: '01', title: '', desc: '' }],
                          faqs: [{ q: '', a: '' }]
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white text-xs font-bold font-space uppercase flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-4.5 h-4.5" />
                      Add Service
                    </button>
                  )}
                </div>

                {editingId && (
                  <form onSubmit={handleSaveService} className="p-6 md:p-8 rounded-3xl glass-panel border border-neon-purple/20 space-y-6">
                    <h3 className="font-space font-bold text-white text-sm uppercase border-b border-white/5 pb-4">
                      {editingId === 'new' ? 'Add New Service' : 'Edit Service Details'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Service Name *</label>
                        <input
                          type="text"
                          required
                          value={currentService.name || ''}
                          onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                          placeholder="e.g. Character Design"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Slug URL *</label>
                        <input
                          type="text"
                          required
                          value={currentService.slug || ''}
                          onChange={(e) => setCurrentService({ ...currentService, slug: e.target.value })}
                          placeholder="e.g. character-design"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Category Segment</label>
                        <select
                          value={currentService.category || 'art-animation'}
                          onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all appearance-none cursor-pointer"
                        >
                          <option value="art-animation">Art & Animation</option>
                          <option value="game-development">Game Development</option>
                          <option value="web-development">Web Development</option>
                          <option value="app-development">App Development</option>
                          <option value="cms-integration">CMS & Database</option>
                          <option value="qa-testing">QA & Testing</option>
                          <option value="shopify-commerce">Shopify Commerce</option>
                          <option value="ar-vr">AR / VR & Metaverse</option>
                          <option value="arch-viz">Architectural Visualization</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Lucide Icon Name *</label>
                        <input
                          type="text"
                          required
                          value={currentService.icon || 'Cpu'}
                          onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                          placeholder="e.g. Palette, Gamepad, Cpu"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Key Benefits (comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(currentService.benefits) ? currentService.benefits.join(', ') : currentService.benefits || ''}
                          onChange={(e) => setCurrentService({ ...currentService, benefits: e.target.value })}
                          placeholder="e.g. Bespoke organic details, Optimized rigs, Substance materials"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Service Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={currentService.description || ''}
                        onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                        placeholder="Detailed description of the service capability..."
                        className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                      />
                    </div>

                    {/* Process Slider Step Editor */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="font-space font-bold text-xs text-white uppercase">Production Process Pipeline</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const steps = Array.isArray(currentService.process) ? [...currentService.process] : [];
                            steps.push({ num: `0${steps.length + 1}`, title: '', desc: '', image: '' });
                            setCurrentService({ ...currentService, process: steps });
                          }}
                          className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all border border-white/10"
                        >
                          <Plus className="w-3 h-3" /> Add Step
                        </button>
                      </div>
                      
                      <div data-lenis-prevent className="space-y-4 max-h-[550px] overflow-y-auto pr-2 dropdown-scrollbar">
                        {((Array.isArray(currentService.process) ? currentService.process : []) as any[]).map((step, sIdx) => (
                          <div key={sIdx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border border-white/5 p-4 rounded-xl relative bg-white/[0.01]">
                            <div className="md:col-span-1">
                              <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Num</label>
                              <input
                                type="text"
                                required
                                value={step.num || ''}
                                onChange={(e) => {
                                  const steps = [...currentService.process];
                                  steps[sIdx] = { ...step, num: e.target.value };
                                  setCurrentService({ ...currentService, process: steps });
                                }}
                                className="w-full text-center text-xs bg-white/5 border border-white/10 rounded-lg py-2 text-white focus:outline-none focus:border-neon-purple"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Step Title</label>
                              <input
                                type="text"
                                required
                                value={step.title || ''}
                                onChange={(e) => {
                                  const steps = [...currentService.process];
                                  steps[sIdx] = { ...step, title: e.target.value };
                                  setCurrentService({ ...currentService, process: steps });
                                }}
                                placeholder="e.g. Character Sculpting"
                                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Step Description</label>
                              <input
                                type="text"
                                required
                                value={step.desc || ''}
                                onChange={(e) => {
                                  const steps = [...currentService.process];
                                  steps[sIdx] = { ...step, desc: e.target.value };
                                  setCurrentService({ ...currentService, process: steps });
                                }}
                                placeholder="e.g. Sculpting structural topology..."
                                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <ImageUpload
                                label="Step Image"
                                value={step.image || ''}
                                onChange={(url) => {
                                  const steps = [...currentService.process];
                                  steps[sIdx] = { ...step, image: url };
                                  setCurrentService({ ...currentService, process: steps });
                                }}
                              />
                            </div>
                            <div className="md:col-span-1 text-center pt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const steps = [...currentService.process];
                                  steps.splice(sIdx, 1);
                                  setCurrentService({ ...currentService, process: steps });
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQ Editor */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="font-space font-bold text-xs text-white uppercase">Frequently Asked Questions</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const faqs = Array.isArray(currentService.faqs) ? [...currentService.faqs] : [];
                            faqs.push({ q: '', a: '' });
                            setCurrentService({ ...currentService, faqs });
                          }}
                          className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all border border-white/10"
                        >
                          <Plus className="w-3 h-3" /> Add FAQ
                        </button>
                      </div>
                      
                      <div data-lenis-prevent className="space-y-4 max-h-[550px] overflow-y-auto pr-2 dropdown-scrollbar">
                        {((Array.isArray(currentService.faqs) ? currentService.faqs : []) as any[]).map((faq, fIdx) => (
                          <div key={fIdx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border border-white/5 p-4 rounded-xl relative bg-white/[0.01]">
                            <div className="md:col-span-4">
                              <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Question</label>
                              <input
                                type="text"
                                required
                                value={faq.q || ''}
                                onChange={(e) => {
                                  const faqs = [...currentService.faqs];
                                  faqs[fIdx] = { ...faq, q: e.target.value };
                                  setCurrentService({ ...currentService, faqs });
                                }}
                                placeholder="e.g. What is the source format?"
                                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-7">
                              <label className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Answer</label>
                              <input
                                type="text"
                                required
                                value={faq.a || ''}
                                onChange={(e) => {
                                  const faqs = [...currentService.faqs];
                                  faqs[fIdx] = { ...faq, a: e.target.value };
                                  setCurrentService({ ...currentService, faqs });
                                }}
                                placeholder="e.g. We provide OBJ, FBX, and ZTL files."
                                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-1 text-center pt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const faqs = [...currentService.faqs];
                                  faqs.splice(fIdx, 1);
                                  setCurrentService({ ...currentService, faqs });
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Service'}
                      </button>
                    </div>
                  </form>
                )}

                {!editingId && (
                  <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/3 border-b border-white/5 text-gray-400 uppercase font-semibold">
                          <th className="p-4">Service Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">URL Slug</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {services.map((srv) => (
                          <tr key={srv.id} className="hover:bg-white/2 text-gray-300">
                            <td className="p-4 font-bold text-white">{srv.name}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[9px] bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-bold uppercase">
                                {srv.category.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">/services/{srv.category}/{srv.slug}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingId(srv.id);
                                  setCurrentService(srv);
                                }}
                                className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white cursor-pointer inline-flex items-center"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('services', srv.id)}
                                className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer inline-flex items-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

    </div>
  );
}

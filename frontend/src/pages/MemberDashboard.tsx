import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MemberDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  // Form state
  const [weekStartDate, setWeekStartDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [tasksPlanned, setTasksPlanned] = useState('');
  const [blockers, setBlockers] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  
  // Custom UI states
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setProjects);
    
    fetchReports();
  }, []);

  const fetchReports = () => {
    fetch('http://localhost:3001/api/reports/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setReports);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/reports', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        week_start_date: weekStartDate,
        project_id: projectId,
        tasks_completed: tasksCompleted,
        tasks_planned: tasksPlanned,
        blockers,
        hours: parseInt(hours),
        notes
      })
    });
    if (res.ok) {
      setToastMessage({ type: 'success', text: 'Report submitted successfully!' });
      setTimeout(() => setToastMessage(null), 3000);
      fetchReports();
      setTasksCompleted('');
      setTasksPlanned('');
      setBlockers('');
      setNotes('');
      setHours('');
    } else {
      const err = await res.json();
      setToastMessage({ type: 'error', text: err.error });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFaf8] font-sans text-gray-900 pb-20">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F26522] rounded flex items-center justify-center text-white font-bold text-xs tracking-wider">
              WS
            </div>
            <span className="font-semibold text-gray-900">Workspace</span>
            <span className="text-gray-300 mx-2">/</span>
            <span className="text-gray-600 font-medium">Weekly Reports</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 mt-12 relative">
        {toastMessage && (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-[slideUp_0.3s_ease-out] ${toastMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              )}
              {toastMessage.text}
            </div>
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Submit Report</h1>
          <p className="text-gray-500">Log your weekly progress and flag any blockers for the team.</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-16">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Week Start Date</label>
                <input type="date" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm" value={weekStartDate} onChange={e => setWeekStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
                <select required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm" value={projectId} onChange={e => setProjectId(e.target.value)}>
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tasks Completed</label>
                <textarea required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm font-mono placeholder-gray-400" placeholder="- Completed homepage design&#10;- Fixed layout bugs" rows={4} value={tasksCompleted} onChange={e => setTasksCompleted(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Planned for Next Week</label>
                <textarea required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm font-mono placeholder-gray-400" placeholder="- Start integration with CMS&#10;- Client review session" rows={3} value={tasksPlanned} onChange={e => setTasksPlanned(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Blockers & Challenges</label>
                <textarea className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm font-mono placeholder-gray-400" placeholder="Waiting on API keys from the client..." rows={2} value={blockers} onChange={e => setBlockers(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hours Logged</label>
                <input type="number" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm" placeholder="e.g. 35" value={hours} onChange={e => setHours(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 focus:border-[#F26522] transition-colors text-sm" placeholder="Optional context..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-[#F26522] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#d95a1e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26522] transition-colors shadow-sm">
                Submit Report
              </button>
            </div>
          </form>
        </div>

        {/* History Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Past Reports</h2>
        </div>
        
        <div className="space-y-6">
          {reports.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Week of {new Date(r.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{r.project_name}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    {r.hours}h logged
                  </span>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Completed</h4>
                  <div className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{r.tasks_completed}</div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Planned Next</h4>
                  <div className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{r.tasks_planned}</div>
                </div>
                
                {(r.blockers || r.notes) && (
                  <div className="md:col-span-2 pt-6 mt-2 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {r.blockers && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Blockers</h4>
                        <div className="text-sm text-red-600 font-mono whitespace-pre-wrap leading-relaxed">{r.blockers}</div>
                      </div>
                    )}
                    {r.notes && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
                        <div className="text-sm text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">{r.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-sm text-gray-500">No reports submitted yet. Your history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

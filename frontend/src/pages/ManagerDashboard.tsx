import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AIChatWidget from '../components/AIChatWidget';

export default function ManagerDashboard() {
  const [metrics, setMetrics] = useState<any>({});
  const [projectStats, setProjectStats] = useState<any[]>([]);
  const [reportTrend, setReportTrend] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<{id: number, name: string} | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchData = () => {
    fetch('http://localhost:3001/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      setMetrics(data.metrics);
      setProjectStats(data.projectStats);
      setReportTrend(data.reportTrend || []);
    });

    fetch('http://localhost:3001/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setReports);

    fetch('http://localhost:3001/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setProjects);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newProjectName })
    });
    setNewProjectName('');
    fetchData();
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.name.trim()) return;
    await fetch(`http://localhost:3001/api/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editingProject.name })
    });
    setEditingProject(null);
    fetchData();
  };

  const handleDeleteProject = async () => {
    if (projectToDelete === null) return;
    await fetch(`http://localhost:3001/api/projects/${projectToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setProjectToDelete(null);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Manager Dashboard</h1>
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Logout
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reports (All Time)</h3>
            <p className="text-3xl font-semibold text-gray-900">{metrics.totalReports || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Reports This Week</h3>
            <p className="text-3xl font-semibold text-gray-900">{metrics.recentReports || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Compliance Rate</h3>
            <p className="text-3xl font-semibold text-green-600">{metrics.complianceRate || 0}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Open Blockers</h3>
            <p className="text-3xl font-semibold text-red-600">{metrics.openBlockers || 0}</p>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Report Submission Trend</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} tickMargin={10} />
                  <YAxis tick={{fontSize: 12, fill: '#6B7280'}} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="count" name="Reports" stroke="#F26522" strokeWidth={3} dot={{r: 4, fill: '#F26522'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Workload by Project</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} tickMargin={10} />
                  <YAxis tick={{fontSize: 12, fill: '#6B7280'}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="reportCount" name="Total Reports" fill="#1a1d2e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: PROJECTS AND REPORTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROJECT MANAGEMENT */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Manage Projects</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <form onSubmit={handleAddProject} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="New project name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                />
                <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add
                </button>
              </form>

              <div className="space-y-2">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    {editingProject?.id === p.id ? (
                      <div className="flex gap-2 w-full">
                        <input 
                          type="text" 
                          autoFocus
                          value={editingProject.name}
                          onChange={e => setEditingProject({...editingProject, name: e.target.value})}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <button onClick={handleUpdateProject} className="text-green-600 text-sm font-medium">Save</button>
                        <button onClick={() => setEditingProject(null)} className="text-gray-500 text-sm font-medium">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setEditingProject(p)} className="text-blue-600 text-xs font-medium hover:underline">Edit</button>
                          <button onClick={() => setProjectToDelete(p.id)} className="text-red-600 text-xs font-medium hover:underline">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {projects.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No projects yet.</p>}
              </div>
            </div>
          </div>

          {/* TEAM REPORTS LIST */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Team Reports</h2>
            <div className="space-y-4">
              {reports.slice(0, 10).map((r: any) => (
                <div key={r.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{r.user_email}</h3>
                      <p className="text-sm text-gray-500">Week of {r.week_start_date} <span className="mx-1">•</span> <span className="font-medium text-[#F26522]">{r.project_name}</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <strong className="text-gray-700 block mb-1">Completed:</strong>
                      <div className="text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">{r.tasks_completed}</div>
                    </div>
                    <div>
                      <strong className="text-gray-700 block mb-1">Planned:</strong>
                      <div className="text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">{r.tasks_planned}</div>
                    </div>
                    {r.blockers && (
                      <div className="md:col-span-2 bg-red-50 p-3 rounded-lg border border-red-100">
                        <strong className="text-red-800 block mb-1 flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          Blockers:
                        </strong>
                        <div className="text-red-700 font-mono whitespace-pre-wrap">{r.blockers}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {reports.length === 0 && <p className="text-gray-500">No reports found.</p>}
            </div>
          </div>
          
        </div>
      </div>
      
      
      <AIChatWidget />

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setProjectToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDeleteProject} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

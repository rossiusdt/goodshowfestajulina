import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, MousePointerClick, ShoppingCart, CheckCircle, TrendingUp, RefreshCw, Lock, Eye, Copy, AlertTriangle, BarChart2, Clock } from 'lucide-react';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://dwosrwbutepaifdwiitl.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Nyd2J1dGVwYWlmZHdpaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTQ3NTcsImV4cCI6MjA5MzczMDc1N30.r0JBp8eMdRzdgm4C9kqMG9icTcVbMJJDsAXaPoqPdPs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DASHBOARD_PASSWORD = 'tribo2025';

interface Event {
  id: string;
  event: string;
  data: Record<string, unknown>;
  session_id: string;
  created_at: string;
}

interface Stats {
  pageViews: number;
  uniqueSessions: number;
  ticketAdds: number;
  checkoutOpens: number;
  pixGenerated: number;
  pixCopied: number;
  paymentSuccess: number;
  paymentErrors: number;
  totalRevenue: number;
  recentEvents: Event[];
  ticketBreakdown: Record<string, number>;
  hourlyViews: { hour: string; count: number }[];
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Visualizou a página',
  ticket_add: 'Adicionou ingresso',
  ticket_remove: 'Removeu ingresso',
  checkout_open: 'Abriu checkout',
  pix_generated: 'Gerou Pix',
  pix_copied: 'Copiou código Pix',
  payment_success: 'Pagamento confirmado',
  payment_error: 'Erro no pagamento',
};

const EVENT_COLORS: Record<string, string> = {
  page_view: 'bg-blue-100 text-blue-700',
  ticket_add: 'bg-green-100 text-green-700',
  ticket_remove: 'bg-orange-100 text-orange-700',
  checkout_open: 'bg-yellow-100 text-yellow-700',
  pix_generated: 'bg-pink-100 text-pink-700',
  pix_copied: 'bg-cyan-100 text-cyan-700',
  payment_success: 'bg-emerald-100 text-emerald-700',
  payment_error: 'bg-red-100 text-red-700',
};

function computeStats(events: Event[]): Stats {
  const pageViews = events.filter(e => e.event === 'page_view').length;
  const uniqueSessions = new Set(events.map(e => e.session_id).filter(Boolean)).size;
  const ticketAdds = events.filter(e => e.event === 'ticket_add').length;
  const checkoutOpens = events.filter(e => e.event === 'checkout_open').length;
  const pixGenerated = events.filter(e => e.event === 'pix_generated').length;
  const pixCopied = events.filter(e => e.event === 'pix_copied').length;
  const paymentSuccess = events.filter(e => e.event === 'payment_success').length;
  const paymentErrors = events.filter(e => e.event === 'payment_error').length;

  const totalRevenue = events
    .filter(e => e.event === 'payment_success')
    .reduce((sum, e) => sum + ((e.data?.amount as number) ?? 0), 0);

  const ticketBreakdown: Record<string, number> = {};
  events
    .filter(e => e.event === 'ticket_add')
    .forEach(e => {
      const name = (e.data?.ticket as string) ?? 'Desconhecido';
      ticketBreakdown[name] = (ticketBreakdown[name] ?? 0) + 1;
    });

  const hourBuckets: Record<string, number> = {};
  events
    .filter(e => e.event === 'page_view')
    .forEach(e => {
      const d = new Date(e.created_at);
      const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}h`;
      hourBuckets[key] = (hourBuckets[key] ?? 0) + 1;
    });

  const hourlyViews = Object.entries(hourBuckets)
    .map(([hour, count]) => ({ hour, count }))
    .slice(-12);

  const recentEvents = [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 40);

  return { pageViews, uniqueSessions, ticketAdds, checkoutOpens, pixGenerated, pixCopied, paymentSuccess, paymentErrors, totalRevenue, recentEvents, ticketBreakdown, hourlyViews };
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-700 font-medium">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('_dash_auth') === '1');
  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(5000);
    if (error) {
      console.error('Analytics fetch error:', error);
    }
    if (data) {
      setStats(computeStats(data as Event[]));
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('_dash_auth', '1');
      setAuthed(true);
    } else {
      setWrongPass(true);
      setTimeout(() => setWrongPass(false), 2000);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm">
          <div className="flex items-center justify-center w-14 h-14 bg-gray-900 rounded-2xl mx-auto mb-6">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-1">Dashboard Analytics</h1>
          <p className="text-sm text-center text-gray-500 mb-6">Digite a senha para acessar</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              autoFocus
              className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors ${wrongPass ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`}
            />
            {wrongPass && <p className="text-xs text-red-500 text-center">Senha incorreta</p>}
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Analytics — Tribo do Forró</h1>
              {lastUpdated && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {!stats ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Eye className="w-5 h-5 text-blue-600" />} label="Visitas" value={stats.pageViews} sub="page views" color="bg-blue-50" />
            <StatCard icon={<Users className="w-5 h-5 text-teal-600" />} label="Sessões únicas" value={stats.uniqueSessions} sub="visitantes" color="bg-teal-50" />
            <StatCard icon={<MousePointerClick className="w-5 h-5 text-orange-600" />} label="Ingressos add." value={stats.ticketAdds} sub="cliques em +" color="bg-orange-50" />
            <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} label="Receita" value={formatCurrency(stats.totalRevenue)} sub={`${stats.paymentSuccess} vendas`} color="bg-emerald-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Funil de conversão */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" /> Funil de Conversão
              </h2>
              <div className="space-y-4">
                <FunnelBar label="Visitaram a página" value={stats.pageViews} max={stats.pageViews} color="bg-blue-400" />
                <FunnelBar label="Adicionaram ingresso" value={stats.ticketAdds} max={stats.pageViews} color="bg-yellow-400" />
                <FunnelBar label="Abriram checkout" value={stats.checkoutOpens} max={stats.pageViews} color="bg-orange-400" />
                <FunnelBar label="Geraram Pix" value={stats.pixGenerated} max={stats.pageViews} color="bg-pink-400" />
                <FunnelBar label="Copiaram o código" value={stats.pixCopied} max={stats.pageViews} color="bg-cyan-400" />
                <FunnelBar label="Pagaram" value={stats.paymentSuccess} max={stats.pageViews} color="bg-emerald-500" />
              </div>
            </div>

            {/* Ingressos mais adicionados + erros */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-500" /> Ingressos Adicionados
                </h2>
                {Object.keys(stats.ticketBreakdown).length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhum dado ainda</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.ticketBreakdown)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{name}</span>
                          <span className="text-sm font-bold bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full">{count}x</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" /> Resumo de Pagamentos
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{stats.paymentSuccess}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Confirmados</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-red-500">{stats.paymentErrors}</p>
                    <p className="text-xs text-red-400 mt-0.5">Erros</p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-pink-600">{stats.pixGenerated}</p>
                    <p className="text-xs text-pink-500 mt-0.5">Pix gerados</p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-cyan-600">{stats.pixCopied}</p>
                    <p className="text-xs text-cyan-500 mt-0.5">Códigos copiados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visitas por hora */}
          {stats.hourlyViews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Visitas por Hora (últimas 12)
              </h2>
              <div className="flex items-end gap-2 h-24">
                {(() => {
                  const max = Math.max(...stats.hourlyViews.map(h => h.count), 1);
                  return stats.hourlyViews.map(h => (
                    <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <span className="text-xs font-semibold text-gray-700">{h.count}</span>
                      <div
                        className="w-full bg-blue-400 rounded-t-md transition-all duration-700"
                        style={{ height: `${Math.max((h.count / max) * 72, 4)}px` }}
                      />
                      <span className="text-[10px] text-gray-400 truncate w-full text-center">{h.hour}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-gray-500" /> Eventos Recentes
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {stats.recentEvents.length === 0 ? (
                <p className="px-6 py-8 text-sm text-gray-400 text-center">Nenhum evento registrado ainda</p>
              ) : (
                stats.recentEvents.map(ev => (
                  <div key={ev.id} className="px-6 py-3 flex items-center gap-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${EVENT_COLORS[ev.event] ?? 'bg-gray-100 text-gray-600'}`}>
                      {EVENT_LABELS[ev.event] ?? ev.event}
                    </span>
                    <span className="text-xs text-gray-500 flex-1 truncate">
                      {ev.event === 'ticket_add' && ev.data?.ticket && `${ev.data.ticket}`}
                      {ev.event === 'checkout_open' && ev.data?.summary && `${ev.data.summary}`}
                      {ev.event === 'pix_generated' && ev.data?.amount && formatCurrency(ev.data.amount as number)}
                      {ev.event === 'payment_success' && ev.data?.amount && formatCurrency(ev.data.amount as number)}
                      {ev.event === 'payment_error' && ev.data?.message && `${ev.data.message}`}
                      {ev.event === 'page_view' && ev.data?.referrer && ev.data.referrer !== '' && `via ${ev.data.referrer}`}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 font-mono">{ev.session_id.slice(0, 8)}</span>
                      <span className="text-xs text-gray-400">{formatTime(ev.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default AnalyticsDashboard
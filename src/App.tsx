import { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ScrollToTop } from './components/ScrollToTop';
import networkImage from './assets/network-infrastructure.jpg';
import smartphoneImage from './assets/smartphone.jpg';
import electronicsImage from './assets/electronics-repair.jpg';
import aiImage from './assets/ai-robot.jpg';
import { 
  Bot, 
  Monitor, 
  Smartphone,
  Cpu,
  Wrench,
  ShieldCheck,
  Code2,
  Globe, 
  MessageSquare, 
  Phone, 
  Mail, 
  Linkedin,
  MapPin,
  User,
  Clock,
  FileText,
  MessageCircle
} from 'lucide-react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    AOS.init({ duration: 700, easing: 'ease-out-quart', once: true, offset: 60 });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Canvas Animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, frame = 0;
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initAll();
    };

    // Layer 1: Neural Network (AI)
    let nodes: any[] = [];
    let signals: any[] = [];

    const initNodes = () => {
      nodes = [];
      signals = [];
      const n = Math.max(28, Math.floor((W * H) / 27000));
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.17,
          vy: (Math.random() - 0.5) * 0.17,
          r: Math.random() * 2.4 + 0.9,
          pulse: Math.random() * Math.PI * 2,
          hub: Math.random() < 0.22,
        });
      }
    };

    const spawnSignal = () => {
      if (nodes.length < 2) return;
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      let best = null,
        bd = 1e9;
      for (let i = 0; i < nodes.length; i++) {
        const nb = nodes[i];
        if (nb === a) continue;
        const d = Math.hypot(nb.x - a.x, nb.y - a.y);
        if (d < bd && d < 210) {
          bd = d;
          best = nb;
        }
      }
      if (best) {
        signals.push({ ax: a.x, ay: a.y, bx: best.x, by: best.y, t: 0, spd: 0.007 + Math.random() * 0.01 });
      }
    };

    const drawNodes = () => {
      const LINK = 185;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${(1 - d / LINK) * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulse += 0.02;
        const g = 0.3 + 0.25 * Math.sin(n.pulse);
        const mx = n.x - mouse.x,
          my = n.y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 155 && md > 0) {
          n.vx += (mx / md) * 0.011;
          n.vy += (my / md) * 0.011;
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;
        if (n.hub) {
          const rg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
          rg.addColorStop(0, `rgba(167,139,250,${g * 0.35})`);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = rg;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (n.hub ? 1.9 : 1), 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? `rgba(167,139,250,${g * 0.9})` : `rgba(124,58,237,${g * 0.7})`;
        ctx.fill();
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += s.spd;
        if (s.t > 1) {
          signals.splice(i, 1);
          continue;
        }
        const sx = s.ax + (s.bx - s.ax) * s.t;
        const sy = s.ay + (s.by - s.ay) * s.t;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216,180,254,${0.9 - s.t})`;
        ctx.fill();
        const t2 = Math.max(0, s.t - 0.1);
        const tx = s.ax + (s.bx - s.ax) * t2,
          ty = s.ay + (s.by - s.ay) * t2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(167,139,250,${0.5 - s.t * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    // Layer 2: Circuits
    let traces: any[] = [];
    let sparks: any[] = [];

    const initCircuits = () => {
      traces = [];
      const count = Math.max(7, Math.floor(W / 140));
      for (let i = 0; i < count; i++) {
        const segs = [];
        let cx = Math.random() * W,
          cy = Math.random() * H;
        segs.push({ x: cx, y: cy });
        const len = 4 + Math.floor(Math.random() * 5);
        for (let s = 0; s < len; s++) {
          const dirs = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
          const ang = dirs[Math.floor(Math.random() * 4)];
          const dist = 40 + Math.random() * 85;
          cx += Math.cos(ang) * dist;
          cy += Math.sin(ang) * dist;
          segs.push({ x: cx, y: cy });
        }
        traces.push({
          segs: segs,
          flow: Math.random(),
          spd: 0.003 + Math.random() * 0.005,
          col: Math.random() < 0.5 ? '0,229,255' : '0,255,178',
          alpha: 0.07 + Math.random() * 0.1,
        });
      }
    };

    const spawnSpark = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2,
          spd = 1.5 + Math.random() * 3.2;
        sparks.push({
          x: x,
          y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
          decay: 0.025 + Math.random() * 0.04,
          r: 1.5 + Math.random() * 2.5,
        });
      }
    };

    const drawCircuits = () => {
      for (let ti = 0; ti < traces.length; ti++) {
        const tr = traces[ti];
        tr.flow = (tr.flow + tr.spd) % 1;
        ctx.beginPath();
        ctx.moveTo(tr.segs[0].x, tr.segs[0].y);
        for (let si = 1; si < tr.segs.length; si++) ctx.lineTo(tr.segs[si].x, tr.segs[si].y);
        ctx.strokeStyle = `rgba(${tr.col},${tr.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        for (let si = 0; si < tr.segs.length; si++) {
          ctx.beginPath();
          ctx.arc(tr.segs[si].x, tr.segs[si].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${tr.col},${tr.alpha * 1.6})`;
          ctx.fill();
        }
        const total = tr.segs.length - 1;
        const fpos = tr.flow * total;
        const idx = Math.min(Math.floor(fpos), total - 1);
        const frac = fpos - idx;
        const pa = tr.segs[idx],
          pb = tr.segs[idx + 1];
        if (pa && pb) {
          const px = pa.x + (pb.x - pa.x) * frac,
            py = pa.y + (pb.y - pa.y) * frac;
          const md = Math.hypot(px - mouse.x, py - mouse.y);
          if (md < 72) spawnSpark(px, py);
          const rg = ctx.createRadialGradient(px, py, 0, px, py, 13);
          rg.addColorStop(0, `rgba(${tr.col},.9)`);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(px, py, 13, 0, Math.PI * 2);
          ctx.fillStyle = rg;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${tr.col},1)`;
          ctx.fill();
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.07;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,50,${s.life * 0.9})`;
        ctx.fill();
      }
    };

    // Layer 3: Data Flow (TI)
    let columns: any[] = [];
    let packets: any[] = [];

    const initData = () => {
      columns = [];
      packets = [];
      const cols = Math.max(10, Math.floor(W / 36));
      for (let i = 0; i < cols; i++) {
        columns.push({
          x: i * 36 + 18,
          y: Math.random() * H,
          spd: 0.6 + Math.random() * 1.4,
          chars: Array.from({ length: 10 }, () => (Math.random() < 0.5 ? '1' : '0')),
          alpha: 0.03 + Math.random() * 0.06,
          len: 4 + Math.floor(Math.random() * 8),
        });
      }
      for (let i = 0; i < 10; i++) addPacket();
    };

    const addPacket = () => {
      const left = Math.random() < 0.5;
      packets.push({
        x: left ? -80 : W + 80,
        y: Math.random() * H,
        vx: left ? 0.7 + Math.random() * 1.2 : -(0.7 + Math.random() * 1.2),
        vy: 0,
        data: [0, 0, 0, 0, 0, 0]
          .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase())
          .join(':'),
        alpha: 0.2 + Math.random() * 0.2,
        w: 92 + Math.random() * 58,
      });
    };

    const drawData = () => {
      ctx.font = '11px monospace';
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.spd;
        if (col.y > H + col.len * 14) col.y = -col.len * 14;
        const md2 = Math.hypot(col.x - mouse.x, col.y - mouse.y);
        if (md2 < 95) col.y -= 1.6;
        for (let c = 0; c < col.len; c++) {
          const cy = col.y - c * 14;
          if (cy < 0 || cy > H) continue;
          ctx.fillStyle =
            c === 0 ? `rgba(0,255,178,${col.alpha * 3})` : `rgba(0,229,255,${col.alpha * (1 - c / col.len)})`;
          ctx.fillText(col.chars[c % col.chars.length], col.x, cy);
        }
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.x += p.vx;
        if (p.x < -200 || p.x > W + 200) {
          packets.splice(i, 1);
          addPacket();
          continue;
        }
        const pmd = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (pmd < 115) p.vy += p.y < mouse.y ? -0.35 : 0.35;
        p.y += p.vy;
        p.vy *= 0.91;
        const h = 22;
        ctx.fillStyle = `rgba(10,126,255,${p.alpha * 0.22})`;
        ctx.strokeStyle = `rgba(0,229,255,${p.alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.roundRect(p.x - p.w / 2, p.y - h / 2, p.w, h, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `rgba(196,212,232,${p.alpha})`;
        ctx.font = '9px monospace';
        ctx.fillText(p.data, p.x - p.w / 2 + 6, p.y + 3);
      }
    };

    // Bolts
    let bolts: any[] = [];
    const maybeBolt = () => {
      const spd = Math.hypot(mouse.vx, mouse.vy);
      if (spd > 16 && Math.random() < 0.13) {
        const segs = [[mouse.x, mouse.y]];
        const ang = Math.atan2(mouse.vy, mouse.vx) + (Math.random() - 0.5) * 0.9;
        const blen = 65 + Math.random() * 90;
        const steps = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < steps; i++) {
          const bt = (i + 1) / steps,
            jit = 22 * (1 - bt);
          segs.push([
            mouse.x + Math.cos(ang) * blen * bt + (Math.random() - 0.5) * jit,
            mouse.y + Math.sin(ang) * blen * bt + (Math.random() - 0.5) * jit,
          ]);
        }
        bolts.push({ segs: segs, life: 1, decay: 0.09 });
      }
    };

    const drawBolts = () => {
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= b.decay;
        if (b.life <= 0) {
          bolts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(b.segs[0][0], b.segs[0][1]);
        for (let j = 1; j < b.segs.length; j++) ctx.lineTo(b.segs[j][0], b.segs[j][1]);
        ctx.strokeStyle = `rgba(255,255,100,${b.life * 0.9})`;
        ctx.lineWidth = b.life * 2.5;
        ctx.shadowColor = 'rgba(255,255,60,.8)';
        ctx.shadowBlur = 12 * b.life;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    const drawGlow = () => {
      if (mouse.x < 0) return;
      const rg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 115);
      rg.addColorStop(0, 'rgba(0,229,255,.08)');
      rg.addColorStop(0.5, 'rgba(10,126,255,.04)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 115, 0, Math.PI * 2);
      ctx.fillStyle = rg;
      ctx.fill();
    };

    const initAll = () => {
      initNodes();
      initCircuits();
      initData();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      if (frame % 78 === 0) spawnSignal();
      if (frame % 215 === 0 && packets.length < 16) addPacket();
      maybeBolt();
      drawGlow();
      drawData();
      drawNodes();
      drawCircuits();
      drawBolts();
      requestAnimationFrame(loop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.px;
      mouse.vy = e.clientY - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = mouse.y = mouse.px = mouse.py = -9999;
      mouse.vx = mouse.vy = 0;
    };


    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    resize();
    loop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 70,
        behavior: 'smooth',
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              {/* Tecnologia: Code Brackets */}
              <path className="logo-path-side" d="M25 35 L15 50 L25 65" stroke="var(--blue)" />
              <path className="logo-path-side" d="M75 35 L85 50 L75 65" stroke="var(--blue)" />
              {/* AI: Neural Node */}
              <circle className="logo-node" cx="50" cy="50" r="4" fill="var(--green)" stroke="none" />
            </svg>
          </div>
          <span>ACS <em>Soluções</em></span>
        </div>
        <ul className="nav-links">
          <li><a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre'); }}>Sobre</a></li>
          <li><a href="#servicos" onClick={(e) => { e.preventDefault(); scrollToSection('servicos'); }}>Serviços</a></li>
          <li><a href="#diferenciais" onClick={(e) => { e.preventDefault(); scrollToSection('diferenciais'); }}>Diferenciais</a></li>
          <li><a href="#instrumentacao" onClick={(e) => { e.preventDefault(); scrollToSection('instrumentacao'); }}>Soluções</a></li>
          <li><a href="#contato" onClick={(e) => { e.preventDefault(); scrollToSection('contato'); }}>Contato</a></li>
        </ul>
        <a href="https://wa.me/5514997230692" target="_blank" className="nav-cta" title="Orçamento pelo WhatsApp">
          <MessageCircle size={20} />
        </a>
        <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} id="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre'); }}>Sobre</a>
        <a href="#servicos" onClick={(e) => { e.preventDefault(); scrollToSection('servicos'); }}>Serviços</a>
        <a href="#diferenciais" onClick={(e) => { e.preventDefault(); scrollToSection('diferenciais'); }}>Diferenciais</a>
        <a href="#instrumentacao" onClick={(e) => { e.preventDefault(); scrollToSection('instrumentacao'); }}>Soluções</a>
        <a href="#contato" onClick={(e) => { e.preventDefault(); scrollToSection('contato'); }}>Contato</a>
        <a href="https://wa.me/5514997230692" target="_blank"><FileText size={18} className="inline mr-2" /> Orçamento pelo WhatsApp</a>
      </div>

      <section id="hero">
        <div className="hero-grid"></div><div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-tag"><span className="dot"></span>Soluções Inteligentes</div>
          <h1 className="hero-title">
            Onde a <span className="acc">Tecnologia</span><br />
            encontra a <span className="blu">Precisão</span><br />
            e a <span className="acc">Inteligência</span>
          </h1>
          <p className="hero-sub">
            A <strong>ACS Soluções</strong> conecta <strong>informática</strong>, <strong>celulares</strong>,
            <strong> eletrônica</strong> e <strong>Inteligência Artificial</strong> para entregar soluções que você realmente precisa.
          </p>
          <div className="hero-badges">
            <span className="hero-badge"><Monitor size={14} className="inline mr-1" /> Informática &amp; Redes</span>
            <span className="hero-badge"><Smartphone size={14} className="inline mr-1" /> Celulares</span>
            <span className="hero-badge"><Cpu size={14} className="inline mr-1" /> Eletrônica</span>
            <span className="hero-badge"><Bot size={14} className="inline mr-1" /> Agentes de IA</span>
            <span className="hero-badge"><Globe size={14} className="inline mr-1" /> Desenvolvimento Web</span>
          </div>
          <div className="hero-cta-group">
            <a href="https://wa.me/5514997230692?text=Olá%20André!%20Gostaria%20de%20solicitar%20um%20orçamento." target="_blank">
              <button className="btn-pulse">Solicitar Orçamento</button>
            </a>
            <a href="#servicos" onClick={(e) => { e.preventDefault(); scrollToSection('servicos'); }}><button className="btn-outline">Ver Serviços →</button></a>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="mouse-icon"><div className="wheel"></div></div><span>Scroll</span>
        </div>
      </section>

      <section id="sobre">
        <div className="container">
          <div className="about-grid">
            <div data-aos="fade-right">
              <div className="avatar-card">
                <div className="avatar-initials">AS</div>
                <div className="avatar-name">André Cândido da Silva</div>
                <div className="avatar-role">Tecnologia · Eletrônica + IA</div>
                <div className="cert-chips">
                  <span className="cert-chip">Informática</span><span className="cert-chip">Celulares</span>
                  <span className="cert-chip">Eletrônica</span><span className="cert-chip">IA &amp; Automação</span>
                  <span className="cert-chip">Dev Web</span>
                </div>
                <div className="stat-row">
                  <div className="stat-box"><div className="stat-num">4</div><div className="stat-lbl">Áreas técnicas</div></div>
                  <div className="stat-box"><div className="stat-num">8h–18h</div><div className="stat-lbl">Segunda a sexta</div></div>
                  <div className="stat-box"><div className="stat-num">IA</div><div className="stat-lbl">Agentes &amp; Auto.</div></div>
                </div>
              </div>
            </div>
            <div className="about-text" data-aos="fade-left">
              <span className="sec-label">Sobre a ACS</span>
              <h2 className="sec-title">Perfil <span>Híbrido</span>,<br />Resultado Superior</h2>
              <div className="sec-div"></div>
              <p>A <strong>ACS Soluções</strong> reúne experiência prática em <strong>informática, celulares e eletrônica</strong>,
              com o desenvolvimento de soluções digitais e <strong>Agentes de Inteligência Artificial</strong>.</p>
              <p>Esse perfil integrado permite diagnosticar equipamentos, organizar a infraestrutura de TI e criar
              automações sob medida, sempre com atendimento claro, responsável e orientado ao resultado.</p>
              <p>Com sede em <strong>Chavantes-SP</strong>, atendemos toda a região com agilidade,
              comprometimento e a certeza de que cada solução é entregue com máxima qualidade técnica.</p>
              <div className="profile-tags">
                <span className="profile-tag">Pensamento Sistêmico</span>
                <span className="profile-tag">Alta Precisão</span>
                <span className="profile-tag">Diagnóstico Técnico</span>
                <span className="profile-tag">Inovação Contínua</span>
                <span className="profile-tag">Atendimento Personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos">
        <div className="container">
          <div style={{ textAlign: 'center' }} data-aos="fade-up">
            <span className="sec-label">O que fazemos</span>
            <h2 className="sec-title">Nossos <span>Serviços</span></h2>
            <div className="sec-div" style={{ margin: '1rem auto 0' }}></div>
          </div>
          <div className="services-grid">
            <div className="service-card card-ti" data-aos="fade-up" data-aos-delay="0">
              <img className="service-image" src={networkImage} alt="Rack de servidores e infraestrutura de rede" />
              <div className="card-number">01</div><div className="card-icon"><Monitor size={32} /></div>
              <h3 className="card-title">Informática e Redes</h3>
              <p className="card-desc">Suporte para computadores, redes e sistemas, com atendimento direto e eficiente.</p>
              <ul className="card-list">
                <li>Formatação, configuração e otimização</li>
                <li>Manutenção preventiva e corretiva</li>
                <li>Redes Wi-Fi, cabeadas e periféricos</li>
                <li>Backup, segurança e recuperação de dados</li>
                <li>Instalação de programas e sistemas</li>
              </ul>
            </div>
            <div className="service-card card-mobile" data-aos="fade-up" data-aos-delay="80">
              <img className="service-image" src={smartphoneImage} alt="Smartphone moderno em destaque" />
              <div className="card-number">02</div><div className="card-icon"><Smartphone size={32} /></div>
              <h3 className="card-title">Celulares e Smartphones</h3>
              <p className="card-desc">Cuidados, ajustes e soluções para manter seu celular rápido, seguro e funcional.</p>
              <ul className="card-list">
                <li>Configuração e transferência de dados</li>
                <li>Atualização e otimização do aparelho</li>
                <li>Diagnóstico de falhas e desempenho</li>
                <li>Instalação de aplicativos e acessórios</li>
                <li>Orientação para uso seguro</li>
              </ul>
            </div>
            <div className="service-card card-electronics" data-aos="fade-up" data-aos-delay="160">
              <img className="service-image" src={electronicsImage} alt="Técnico realizando reparo em uma placa eletrônica" />
              <div className="card-number">03</div><div className="card-icon"><Cpu size={32} /></div>
              <h3 className="card-title">Eletrônica em Geral</h3>
              <p className="card-desc">Análise técnica de equipamentos eletrônicos para localizar falhas e orientar o reparo.</p>
              <ul className="card-list">
                <li>Diagnóstico de placas e componentes</li>
                <li>Testes de funcionamento e conectividade</li>
                <li>Configuração de equipamentos eletrônicos</li>
                <li>Orientação para manutenção e substituição</li>
                <li>Automação de pequenos projetos</li>
              </ul>
            </div>
            <div className="service-card card-ia" data-aos="fade-up" data-aos-delay="240">
              <img className="service-image" src={aiImage} alt="Robô humanoide representando soluções com inteligência artificial" />
              <div className="card-number">04</div><div className="card-icon"><Bot size={32} /></div>
              <h3 className="card-title">Soluções com IA</h3>
              <p className="card-desc">Automatize tarefas e transforme ideias em ferramentas inteligentes para sua rotina.</p>
              <ul className="card-list">
                <li>Agentes e assistentes personalizados</li>
                <li>Automação de tarefas repetitivas</li>
                <li>Chatbots para atendimento</li>
                <li>Integração com sistemas e APIs</li>
                <li>Análise de dados e produtividade</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="diferenciais">
        <div className="container">
          <div data-aos="fade-up">
            <span className="sec-label">Por que escolher a ACS</span>
            <h2 className="sec-title">Diferenciais <span>da ACS</span></h2>
            <div className="sec-div"></div>
          </div>
          <div className="diff-grid">
            <div className="diff-block hl-block" data-aos="fade-up">
              <div className="diff-header">
                <div className="diff-icon"><Wrench size={28} className="text-cyan-400" /></div>
                <div>
                  <div className="diff-title">Diagnóstico com precisão</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--gray-light)', marginTop: '.3rem', lineHeight: 1.6 }}>
                    Avaliação cuidadosa de equipamentos e sistemas para decisões práticas, transparentes e baseadas em dados reais.
                  </p>
                </div>
              </div>
            </div>
            <div className="diff-block" data-aos="fade-up" data-aos-delay="50">
              <div className="diff-header"><div className="diff-icon"><ShieldCheck size={28} className="text-cyan-400" /></div><div className="diff-title">Confiabilidade &amp; Segurança</div></div>
              <div className="diff-items">
                <div className="diff-item"><span className="tick">✓</span><span>Atendimento com <strong>clareza e responsabilidade</strong></span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Diagnóstico antes de qualquer <strong>recomendação</strong></span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Orientação sobre <strong>segurança digital e backups</strong></span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Explicação simples para cada <strong>solução proposta</strong></span></div>
              </div>
            </div>
            <div className="diff-block" data-aos="fade-up" data-aos-delay="100">
              <div className="diff-header"><div className="diff-icon"><Code2 size={28} className="text-cyan-400" /></div><div className="diff-title">Abordagem Integrada</div></div>
              <div className="diff-items">
                <div className="diff-item"><span className="tick">✓</span><span>Atendimento integrado em <strong>TI, celulares e eletrônica</strong></span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Visão prática do problema e da solução</span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Soluções sob medida para <strong>pessoas e empresas</strong></span></div>
                <div className="diff-item"><span className="tick">✓</span><span>Da análise inicial à <strong>entrega orientada</strong></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instrumentacao">
        <div className="container">
          <div data-aos="fade-up">
            <span className="sec-label">Soluções sob medida</span>
            <h2 className="sec-title">Tecnologia que <span>resolve</span></h2>
            <div className="sec-div"></div>
            <p style={{ color: 'var(--gray-light)', maxWidth: '640px', fontSize: '.95rem', lineHeight: 1.7, marginBottom: '.5rem' }}>
              Da manutenção de computadores ao desenvolvimento de automações, cada atendimento começa entendendo
              a necessidade real e termina com uma solução clara, útil e acessível.
            </p>
          </div>
          <div className="instr-grid">

            <div className="instr-card ic-mega" data-aos="fade-up" data-aos-delay="0">
              <div className="instr-header">
                <div className="instr-emoji"><Wrench size={40} /></div>
                <div><div className="instr-name">Manutenção de Computadores</div><div className="instr-abbr">Diagnóstico · Otimização · Suporte</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Seu computador está lento, instável ou apresentando falhas? Fazemos uma análise completa para encontrar a causa e indicar o melhor caminho.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Formatação e instalação de sistemas</li>
                    <li>Limpeza, otimização e atualização</li>
                    <li>Configuração de programas e periféricos</li>
                    <li>Backup e recuperação de arquivos</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> equipamento mais estável, organizado e pronto para sua rotina.</div>
              </div>
            </div>

            <div className="instr-card ic-micro" data-aos="fade-up" data-aos-delay="60">
              <div className="instr-header">
                <div className="instr-emoji"><Smartphone size={40} /></div>
                <div><div className="instr-name">Cuidados com Celulares</div><div className="instr-abbr">Configuração · Dados · Segurança</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Ajudamos você a configurar, organizar e aproveitar melhor seu smartphone, com atenção aos seus dados e à sua privacidade.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Transferência de fotos e contatos</li>
                    <li>Configuração de contas e aplicativos</li>
                    <li>Atualização e organização do aparelho</li>
                    <li>Orientação sobre privacidade e segurança</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> mais autonomia para usar seu aparelho com confiança.</div>
              </div>
            </div>

            <div className="instr-card ic-dtr" data-aos="fade-up" data-aos-delay="120">
              <div className="instr-header">
                <div className="instr-emoji"><Cpu size={40} /></div>
                <div><div className="instr-name">Eletrônica e Diagnóstico</div><div className="instr-abbr">Testes · Componentes · Equipamentos</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Investigamos falhas em equipamentos eletrônicos e ajudamos a identificar quando vale reparar, atualizar ou substituir.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Diagnóstico de placas e componentes</li>
                    <li>Testes de conectividade e funcionamento</li>
                    <li>Configuração de roteadores e dispositivos</li>
                    <li>Orientação para reparo e manutenção</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> decisões técnicas com menos tentativa e erro.</div>
              </div>
            </div>

            <div className="instr-card ic-vlf" data-aos="fade-up" data-aos-delay="180">
              <div className="instr-header">
                <div className="instr-emoji"><ShieldCheck size={40} /></div>
                <div><div className="instr-name">Segurança Digital</div><div className="instr-abbr">Proteção · Backup · Boas práticas</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Proteja suas contas, arquivos e dispositivos com uma organização digital simples e adequada à sua realidade.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Configuração de senhas e autenticação</li>
                    <li>Orientação para backups locais e em nuvem</li>
                    <li>Organização de arquivos e acessos</li>
                    <li>Boas práticas para evitar golpes e perdas</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> mais controle sobre sua vida digital.</div>
              </div>
            </div>

            <div className="instr-card ic-cura" data-aos="fade-up" data-aos-delay="240">
              <div className="instr-header">
                <div className="instr-emoji"><Code2 size={40} /></div>
                <div><div className="instr-name">Sites e Aplicações</div><div className="instr-abbr">Web · Automação · Presença digital</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Criamos páginas e ferramentas digitais com visual profissional, boa experiência em celulares e foco no objetivo do negócio.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Sites institucionais e páginas de serviço</li>
                    <li>Landing pages para divulgação</li>
                    <li>Formulários e integrações</li>
                    <li>Responsividade, desempenho e SEO</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> presença digital pronta para gerar oportunidades.</div>
              </div>
            </div>

            <div className="instr-card ic-hipot" data-aos="fade-up" data-aos-delay="300">
              <div className="instr-header">
                <div className="instr-emoji"><Bot size={40} /></div>
                <div><div className="instr-name">Automação com IA</div><div className="instr-abbr">Assistentes · Processos · Produtividade</div></div>
              </div>
              <div className="instr-body">
                <div className="instr-what">Use inteligência artificial de forma prática para ganhar tempo, organizar informações e melhorar o atendimento.</div>
                <div>
                  <div className="instr-apps-title">Aplicações</div>
                  <ul className="instr-app-list">
                    <li>Assistentes para tarefas do dia a dia</li>
                    <li>Organização e resumo de informações</li>
                    <li>Automação de rotinas administrativas</li>
                    <li>Chatbots e atendimento inteligente</li>
                    <li>Integração com ferramentas e APIs</li>
                  </ul>
                </div>
                <div className="instr-norm"><strong>Resultado:</strong> tecnologia aplicada com propósito e sem complicação.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="web-dev">
        <div className="container">
          <div className="webdev-inner" data-aos="zoom-in">
            <div className="webdev-icon"><Globe size={64} className="text-blue-500" /></div>
            <div className="webdev-text">
              <span className="sec-label">Desenvolvimento Web</span>
              <h2 className="sec-title">Sites &amp; <span>Aplicações</span> Modernas</h2>
              <p>Além dos serviços técnicos, a ACS Soluções desenvolve <strong style={{ color: 'var(--cyan)' }}>sites
              profissionais, landing pages e aplicações web</strong> sob medida — com foco em performance,
              responsividade e conversão. Da identidade visual ao código, entregamos a presença digital que sua empresa merece.</p>
              <div className="tech-stack">
                <span className="tech-tag">HTML5</span><span className="tech-tag">CSS3</span>
                <span className="tech-tag">JavaScript</span><span className="tech-tag">React</span>
                <span className="tech-tag">UX/UI Design</span><span className="tech-tag">SEO Técnico</span>
                <span className="tech-tag">Performance Web</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contato">
        <div className="container">
          <div data-aos="fade-up">
            <span className="sec-label">Fale Conosco</span>
            <h2 className="sec-title">Pronto para <span>Começar?</span></h2>
            <div className="sec-div" style={{ margin: '1rem auto' }}></div>
            <p style={{ color: 'var(--gray-light)', maxWidth: '520px', margin: '0 auto', fontSize: '.95rem' }}>
              Entre em contato pelo canal de sua preferência. Responderemos rapidamente!
            </p>
          </div>
          <div className="contact-grid">
            <a href="https://wa.me/5514997230692?text=Olá%20André!%20Gostaria%20de%20um%20orçamento." target="_blank">
              <div className="contact-card wapp" data-aos="fade-up" data-aos-delay="0">
                <div className="cc-icon"><MessageSquare size={32} className="text-green-500" /></div><div className="cc-label">WhatsApp Principal</div>
                <div className="cc-val">(14) 99723-0692</div><div className="cc-sub">Clique para chamar no WhatsApp</div>
              </div>
            </a>
            <a href="https://wa.me/5514981347500?text=Olá%20André!%20Gostaria%20de%20um%20orçamento." target="_blank">
              <div className="contact-card wapp" data-aos="fade-up" data-aos-delay="80">
                <div className="cc-icon"><Phone size={32} className="text-green-400" /></div><div className="cc-label">WhatsApp Secundário</div>
                <div className="cc-val">(14) 98134-7500</div><div className="cc-sub">Clique para chamar no WhatsApp</div>
              </div>
            </a>
            <a href="mailto:andrecandido.s@gmail.com?subject=Contato%20via%20Site%20ACS%20Soluções">
              <div className="contact-card" data-aos="fade-up" data-aos-delay="160">
                <div className="cc-icon"><Mail size={32} className="text-blue-400" /></div><div className="cc-label">E-mail</div>
                <div className="cc-val" style={{ fontSize: '.78rem' }}>andrecandido.s@gmail.com</div>
                <div className="cc-sub">Enviar mensagem por e-mail</div>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/andrecandidosilva" target="_blank">
              <div className="contact-card lkdn" data-aos="fade-up" data-aos-delay="240">
                <div className="cc-icon"><Linkedin size={32} className="text-blue-600" /></div><div className="cc-label">LinkedIn</div>
                <div className="cc-val">André Cândido Silva</div><div className="cc-sub">Conectar profissionalmente</div>
              </div>
            </a>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} data-aos="fade-up">
            <div className="contact-info">
              <p><MapPin size={16} className="inline mr-2 text-cyan-400" /> <strong>Localização:</strong> Chavantes – SP<br />
                 <User size={16} className="inline mr-2 text-cyan-400" /> <strong>Responsável:</strong> André Cândido da Silva<br />
                 <Clock size={16} className="inline mr-2 text-cyan-400" /> <strong>Atendimento:</strong> Segunda a Sexta, 8h–18h | Urgências: plantão WhatsApp</p>
            </div>
          </div>
          <div className="cta-row" data-aos="fade-up">
            <a href="https://wa.me/5514997230692?text=Olá%20André!%20Quero%20solicitar%20um%20orçamento." target="_blank">
              <button className="btn-pulse" style={{ fontSize: '.82rem', padding: '.8rem 2rem' }}>Solicitar Orçamento Agora</button>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 <span>ACS Soluções</span> · André Cândido da Silva · Chavantes-SP</p>
        <p style={{ marginTop: '.4rem', fontSize: '.78rem', opacity: .6, letterSpacing: '0.02em' }}>Informática · Celulares · Eletrônica · Inteligência Artificial</p>
      </footer>
      <ScrollToTop />
    </div>
  );
}

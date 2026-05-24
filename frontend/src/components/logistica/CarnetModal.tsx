'use client';

import { useState } from 'react';
import { X, LayoutTemplate, Printer, RefreshCcw, UserRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Personal, TipoPersonal } from '@/models/personal';

const SECTOR_COLORS: Record<TipoPersonal, { bg: string; text: string; border: string; hex: string; label: string }> = {
  LOGISTICO:     { bg: 'bg-[#C0392B]', text: 'text-[#C0392B]', border: 'border-[#C0392B]', hex: '#C0392B', label: 'Logística' },
  ADMINISTRATIVO:{ bg: 'bg-[#1A6B3C]', text: 'text-[#1A6B3C]', border: 'border-[#1A6B3C]', hex: '#1A6B3C', label: 'Administrativo' },
  PRENSA:        { bg: 'bg-[#D4A017]', text: 'text-[#D4A017]', border: 'border-[#D4A017]', hex: '#D4A017', label: 'Prensa' },
};

const getColors = (tipo: TipoPersonal) => SECTOR_COLORS[tipo] ?? SECTOR_COLORS['LOGISTICO'];

export function CarnetModal({ personal, onClose }: { personal: Personal; onClose: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = getColors(personal.tipoPersonal);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-slate-100 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg p-8 animate-in zoom-in-95 duration-300">
        {/* Header del modal */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-red-600" />
            Vista Previa de Carné
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenedor del carnet */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-[240px] h-[380px] mb-6" style={{ perspective: '1000px' }}>
            <div
              className="w-full h-full transition-all duration-700 relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* ===== CARA FRONTAL ===== */}
              <div
                className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Header de color */}
                <div className={`${colors.bg} flex flex-col items-center pt-4 pb-10 px-4 relative overflow-hidden`}>
                  {/* Silueta bailarines */}
                  <img
                    src="/sombrero-ruana.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    style={{ mixBlendMode: 'multiply', opacity: 0.28 }}
                  />
                  <style>{`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}</style>
                  <span
                    style={{ fontFamily: 'Pacifico, cursive', fontSize: '2.4rem', lineHeight: 1, color: '#FFE066', textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}
                  >
                    65
                  </span>
                  <span
                    style={{ fontFamily: 'Pacifico, cursive', fontSize: '0.72rem', color: 'white', lineHeight: 1.3, textAlign: 'center' }}
                  >
                    Festival del Bambuco
                  </span>
                  <p className="text-white/60 text-[8px] uppercase tracking-[0.25em] mt-1 font-medium">
                    CorpoSanpedro
                  </p>
                </div>

                {/* Foto */}
                <div className="flex justify-center -mt-8 z-10">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <UserRound className="w-9 h-9 text-slate-300" />
                  </div>
                </div>

                {/* Cuerpo */}
                <div className="flex flex-col items-center flex-1 px-5 pt-3 pb-4 gap-1 relative">
                  {/* Fondo bailarines */}
                  <div
                    className="absolute inset-0 bg-no-repeat bg-center bg-contain pointer-events-none"
                    style={{ backgroundImage: "url('/bailarines.png')", opacity: 0.13 }}
                  />
                  {/* Nombre */}
                  <h3 className="text-slate-800 font-black text-lg uppercase leading-tight text-center tracking-tight">
                    {personal.primerNombre} {personal.primerApellido}
                  </h3>

                  {/* Cargo / tipo */}
                  <span className={`${colors.bg} text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mt-0.5`}>
                    {personal.cargoNombre || colors.label}
                  </span>

                  {/* Separador */}
                  <div className={`w-10 h-0.5 ${colors.bg} rounded-full opacity-40 my-2`} />

                  {/* Documento */}
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Documento</p>
                    <p className="text-sm font-bold text-slate-700 tracking-wide">{personal.numeroDocumento}</p>
                  </div>

                  {/* Número camiseta (si existe) */}
                  {personal.numeroCamiseta && (
                    <div className="text-center mt-1">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Camiseta</p>
                      <p className={`text-xl font-black leading-none ${colors.text}`}>#{personal.numeroCamiseta}</p>
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Footer */}
                  <div className={`w-full border-t ${colors.border} border-opacity-20 pt-2 text-center`}>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest">Personal Autorizado</p>
                  </div>
                </div>
              </div>

              {/* ===== CARA POSTERIOR ===== */}
              <div
                className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col items-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {/* Barra superior de color */}
                <div className={`w-full h-3 ${colors.bg}`} />

                {/* Header posterior — mismo estilo que el frente */}
                <div className="text-center mt-3 flex flex-col items-center">
                  <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '2rem', lineHeight: 1, color: colors.hex }}>
                    65
                  </span>
                  <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '0.65rem', color: '#1e293b', lineHeight: 1.3 }}>
                    Festival del Bambuco
                  </span>
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em] mt-0.5 font-medium">CorpoSanpedro</p>
                  <div className={`w-10 h-0.5 ${colors.bg} mx-auto mt-1.5 rounded-full opacity-60`} />
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm relative">
                    <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 border-t-[3px] border-l-[3px] ${colors.border} rounded-tl-md`} />
                    <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 border-t-[3px] border-r-[3px] ${colors.border} rounded-tr-md`} />
                    <div className={`absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-[3px] border-l-[3px] ${colors.border} rounded-bl-md`} />
                    <div className={`absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-[3px] border-r-[3px] ${colors.border} rounded-br-md`} />

                    {/* QR + logo en cuadro centrado */}
                    <div className="relative">
                      {personal.codigoQr ? (
                        <QRCodeSVG value={personal.codigoQr} size={110} level="H" includeMargin={false} />
                      ) : (
                        <div className="w-[110px] h-[110px] flex items-center justify-center text-slate-300 text-xs text-center px-2">
                          Sin QR asignado
                        </div>
                      )}
                      {/* Cuadro blanco con bordes redondos + logo encima */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg flex items-center justify-center shadow-sm"
                        style={{ width: 36, height: 36, zIndex: 10 }}
                      >
                        <img
                          src="/logo-corposanpedro.png"
                          alt="CorpoSanpedro"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-3">
                    Escanea para verificar
                  </p>
                </div>

                {/* Footer posterior */}
                <div className="text-center px-5 mb-5 w-full">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest truncate">
                    {personal.nombreCompleto}
                  </p>
                  <p className="text-[8px] text-slate-400 mt-0.5">Este carné es personal e intransferible.</p>
                  {/* Barra inferior de color */}
                  <div className={`w-full h-1.5 ${colors.bg} rounded-full mt-3 opacity-60`} />
                </div>
              </div>
            </div>
          </div>

          {/* Botón girar */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="group flex items-center gap-2 bg-white hover:bg-red-600 text-slate-600 hover:text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 active:scale-95 text-sm"
          >
            <RefreshCcw className={`w-4 h-4 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>Girar a cara {isFlipped ? 'Frontal' : 'Posterior'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

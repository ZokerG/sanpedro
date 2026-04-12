'use client';

import { useState } from 'react';
import { X, UserRound, LayoutTemplate, Printer, RefreshCcw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Personal } from '@/models/personal';

// Colors map based on sector names
const getSectorColors = (rolNombre: string | undefined) => {
  const name = (rolNombre || '').toUpperCase();
  if (name.includes('LOGISTICA') || name.includes('LOGÍSTICA')) {
    return { bg: 'bg-[#C0392B]', text: 'text-[#C0392B]', border: 'border-[#C0392B]', badgebg: 'bg-[#C0392B]', badgeText: 'text-white' };
  }
  if (name.includes('CULTURA')) {
    return { bg: 'bg-[#6C3483]', text: 'text-[#6C3483]', border: 'border-[#6C3483]', badgebg: 'bg-[#6C3483]', badgeText: 'text-white' };
  }
  if (name.includes('FINANZAS')) {
    return { bg: 'bg-[#1A6B3C]', text: 'text-[#1A6B3C]', border: 'border-[#1A6B3C]', badgebg: 'bg-[#1A6B3C]', badgeText: 'text-white' };
  }
  if (name.includes('DIRECTOR')) {
    return { bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', badgebg: 'bg-slate-800', badgeText: 'text-white' };
  }
  return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', badgebg: 'bg-blue-600', badgeText: 'text-white' };
};

export function CarnetModal({ personal, onClose }: { personal: Personal; onClose: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = getSectorColors(personal.cargoNombre);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center perspective-[2000px]">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-slate-100 rounded-2xl shadow-2xl relative z-10 w-full max-w-2xl p-8 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-red-600" />
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

        {/* 3D Container */}
        <div className="flex flex-col items-center justify-center">
          
          <div className="relative w-[450px] aspect-[1.58] mb-8" style={{ perspective: '1000px' }}>
            <div 
              className={`w-full h-full transition-all duration-700 relative`}
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
              }}
            >
              {/* === CARA FRONTAL === */}
              <div 
                className="absolute inset-0 w-full h-full bg-white rounded-[16px] shadow-xl border border-slate-200 overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Top Banner (Left Column) */}
                <div className={`absolute top-0 left-0 w-[140px] h-full ${colors.bg} flex flex-col items-center py-6 px-4`}>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  <div className="text-white font-bold text-center leading-tight tracking-tight mt-2 z-10 drop-shadow-md">
                    <span className="block text-lg">FESTIVAL</span>
                    <span className="block text-sm font-light">SAN PEDRO</span>
                    <span className="block text-[10px] uppercase opacity-80 mt-1">del Huila</span>
                  </div>
                  
                  {/* Photo */}
                  <div className={`w-20 h-20 bg-slate-100 rounded-full mt-5 shadow-lg border-4 border-white/20 flex items-center justify-center overflow-hidden z-10`}>
                    <UserRound className="w-10 h-10 text-slate-300" />
                  </div>
                </div>

                {/* Right Content */}
                <div className="absolute top-0 left-[140px] right-0 h-full flex flex-col justify-between p-5">
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/binding-light.png')] pointer-events-none"></div>
                  
                  {/* Badge */}
                  <div className="flex justify-end relative z-10">
                     <div className={`${colors.badgebg} ${colors.badgeText} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-black/5`}>
                       {personal.cargoNombre || personal.tipoPersonal}
                     </div>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 px-2 mt-2">
                    <h3 className={`font-black text-2xl uppercase tracking-tight text-slate-800 leading-none mb-1`}>
                      {personal.primerNombre} <br/>
                      <span className="text-slate-600">{personal.primerApellido}</span>
                    </h3>
                    <p className={`font-semibold text-xs tracking-widest ${colors.text} uppercase`}>
                      {personal.cargoNombre || 'Apoyo'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 px-2 flex justify-between items-end border-t border-slate-100 pt-3 pb-1">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Documento</p>
                      <p className="text-xs font-bold text-slate-700 tracking-wide">{personal.numeroDocumento}</p>
                    </div>
                    {personal.numeroCamiseta && (
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Camiseta</p>
                        <p className={`text-xl leading-none font-black ${colors.text}`}>#{personal.numeroCamiseta}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* === CARA POSTERIOR === */}
              <div 
                className="absolute inset-0 w-full h-full bg-white rounded-[16px] shadow-xl border border-slate-200 overflow-hidden flex flex-col items-center justify-between py-5 px-6"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className={`w-full absolute top-0 left-0 right-0 h-2.5 ${colors.bg}`}></div>
                
                {/* Header Posterior */}
                <div className="text-center mt-2">
                   <h4 className="font-bold text-slate-800 text-sm tracking-widest uppercase">CorpoSanpedro</h4>
                   <div className={`w-12 h-0.5 ${colors.bg} mx-auto mt-1 rounded-full opacity-60`}></div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center flex-1 w-full my-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm relative group">
                    <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 border-t-[3px] border-l-[3px] ${colors.border} rounded-tl-md`}></div>
                    <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 border-t-[3px] border-r-[3px] ${colors.border} rounded-tr-md`}></div>
                    <div className={`absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-[3px] border-l-[3px] ${colors.border} rounded-bl-md`}></div>
                    <div className={`absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-[3px] border-r-[3px] ${colors.border} rounded-br-md`}></div>

                    {personal.codigoQr ? (
                      <QRCodeSVG value={personal.codigoQr} size={100} level="H" includeMargin={false} />
                    ) : (
                      <div className="w-[100px] h-[100px] flex justify-center items-center text-slate-300 text-xs">Sin QR</div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 font-semibold uppercase tracking-widest mt-3">
                    Escanea para verificar identidad
                  </p>
                </div>

                {/* Footer Posterior */}
                <div className="text-center w-full">
                   <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest truncate w-full px-4">
                     {personal.nombreCompleto}
                   </p>
                   <p className="text-[8px] text-slate-400 mt-0.5">
                     Este carné es personal e intransferible.
                   </p>
                </div>
              </div>

            </div>
          </div>

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group flex items-center gap-2 bg-white hover:bg-red-600 text-slate-600 hover:text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 active:scale-95"
          >
            <RefreshCcw className={`w-5 h-5 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>Girar Carné a la cara {isFlipped ? 'Frontal' : 'Posterior'}</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}

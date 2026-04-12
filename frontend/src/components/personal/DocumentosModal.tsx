'use client';

import { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Eye, 
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { 
  TipoDocumentoRequerido, 
  TIPO_DOCUMENTO_REQ_LABELS, 
  DocumentoPersonal 
} from '@/models/documento';
import {
  useDocumentosPersonal,
  useUploadDocumento,
  useDeleteDocumento,
  useUpdateEstadoDocumento
} from '@/hooks/useDocumentos';
import { cn } from '@/lib/utils';

interface DocumentosModalProps {
  personalId: number;
  personalNombre: string;
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPES: TipoDocumentoRequerido[] = [
  'CEDULA',
  'RUT',
  'CERTIFICADO_BANCARIO',
  'CONTRATO_FIRMADO',
  'FOTO_PERFIL'
];

export function DocumentosModal({ personalId, personalNombre, isOpen, onClose }: DocumentosModalProps) {
  const { data: documentos, isLoading: isDocsLoading } = useDocumentosPersonal(personalId);
  const uploadMutation = useUploadDocumento();
  const deleteMutation = useDeleteDocumento(personalId);
  const updateEstadoMutation = useUpdateEstadoDocumento();
  
  const [uploadingType, setUploadingType] = useState<TipoDocumentoRequerido | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, tipo: TipoDocumentoRequerido) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingType(tipo);
      await uploadMutation.mutateAsync({ personalId, tipo, file });
    } finally {
      setUploadingType(null);
    }
  };

  const getDocStatus = (tipo: TipoDocumentoRequerido) => {
    return documentos?.find(d => d.tipoDocumentoRequerido === tipo);
  };

  const renderStatusBadge = (doc?: DocumentoPersonal) => {
    if (!doc) return (
      <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
        <Clock className="w-3.5 h-3.5" /> Faltante
      </span>
    );

    switch (doc.estado) {
      case 'VERIFICADO':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
          </span>
        );
      case 'RECHAZADO':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-100">
            <AlertCircle className="w-3.5 h-3.5" /> Rechazado
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-100">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Expediente Documental</h3>
            <p className="text-sm text-slate-500">{personalNombre}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {isDocsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Cargando expediente...</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {DOCUMENT_TYPES.map(tipo => {
                const doc = getDocStatus(tipo);
                const isUploading = uploadingType === tipo;

                return (
                  <div 
                    key={tipo}
                    className={cn(
                      "group p-4 rounded-xl border transition-all duration-200",
                      doc ? "bg-white border-slate-200 hover:shadow-md" : "bg-slate-50 border-dashed border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2.5 rounded-lg",
                          doc ? "bg-indigo-50 text-indigo-600" : "bg-white text-slate-300 border border-slate-200"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {TIPO_DOCUMENTO_REQ_LABELS[tipo]}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            {renderStatusBadge(doc)}
                            {doc && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {doc.nombreOriginalArchivo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        {doc ? (
                          <>
                            <a
                              href={doc.presignedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Ver documento"
                            >
                              <ExternalLink className="w-4.5 h-4.5" />
                            </a>
                            {doc.estado === 'PENDIENTE' && (
                              <>
                                <button
                                  onClick={() => updateEstadoMutation.mutate({
                                    id: doc.id,
                                    estado: 'VERIFICADO',
                                    personalId,
                                  })}
                                  disabled={updateEstadoMutation.isPending}
                                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                                  title="Verificar documento"
                                >
                                  <CheckCircle2 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const nota = prompt('Motivo del rechazo:');
                                    if (nota !== null) {
                                      updateEstadoMutation.mutate({
                                        id: doc.id,
                                        estado: 'RECHAZADO',
                                        notaRevision: nota || undefined,
                                        personalId,
                                      });
                                    }
                                  }}
                                  disabled={updateEstadoMutation.isPending}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                  title="Rechazar documento"
                                >
                                  <AlertCircle className="w-4.5 h-4.5" />
                                </button>
                              </>
                            )}
                            {doc.estado === 'RECHAZADO' && (
                              <button
                                onClick={() => updateEstadoMutation.mutate({
                                  id: doc.id,
                                  estado: 'VERIFICADO',
                                  personalId,
                                })}
                                disabled={updateEstadoMutation.isPending}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                                title="Revertir: verificar documento"
                              >
                                <CheckCircle2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este documento?')) {
                                  deleteMutation.mutate(doc.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </>
                        ) : (
                          <div className="relative">
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => handleFileChange(e, tipo)}
                              disabled={isUploading}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <button className={cn(
                              "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm",
                              isUploading 
                                ? "bg-white text-slate-400 border-slate-200" 
                                : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                            )}>
                              {isUploading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              {isUploading ? 'Subiendo...' : 'Subir'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {doc?.notaRevision && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                        <strong>Nota:</strong> {doc.notaRevision}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar carpeta
          </button>
        </div>

      </div>
    </div>
  );
}

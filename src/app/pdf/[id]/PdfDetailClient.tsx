"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CalendarDays,
  BookOpen,
  User,
  Tag,
  Hash,
  Type,
  AlertTriangle,
  Info,
  LoaderCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  FileTextIcon,
  Play,
  Loader,
  Brain,
  Zap,
} from "lucide-react";
import { supabaseAnonKey } from "@/app/lib/supabaseClient";
import { Database } from "@/app/lib/database.types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type PdfDocument = Database["public"]["Tables"]["pdf_documents"]["Row"];

interface PdfDetailClientProps {
  pdfId: string;
}

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  loading: boolean;
  error?: string;
}

const formatNumber = (num: number | null | undefined): string =>
  num == null ? "Brak danych" : num.toLocaleString("pl-PL");

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
  isBoolean?: boolean;
  booleanValue?: boolean;
}> = ({
  icon: Icon,
  label,
  value,
  isBoolean = false,
  booleanValue = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
  >
    <Icon className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      {isBoolean ? (
        booleanValue ? (
          <span className="flex items-center text-lg font-semibold text-green-600">
            <CheckCircle size={20} className="mr-1" /> Tak
          </span>
        ) : (
          <span className="flex items-center text-lg font-semibold text-red-600">
            <XCircle size={20} className="mr-1" /> Nie
          </span>
        )
      ) : (
        <p className="text-lg font-semibold text-slate-700">{value ?? "Brak danych"}</p>
      )}
    </div>
  </motion.div>
);

const SummarySection: React.FC<{ summary: string }> = ({ summary }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
  >
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
      <div className="flex items-center space-x-3">
        <FileTextIcon className="w-6 h-6 text-white" />
        <h2 className="text-xl font-semibold text-white">Streszczenie dokumentu</h2>
      </div>
    </div>
    <div className="p-6">
      <div className="prose prose-slate max-w-none">
        <p className="text-lg leading-relaxed text-slate-700 font-medium">
          {summary}
        </p>
      </div>
    </div>
  </motion.div>
);

const ProcessingSteps: React.FC<{ 
  steps: ProcessingStep[]; 
  currentStep: number;
  isProcessing: boolean;
}> = ({ steps, currentStep }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tworzenie kursu e-learningowego
        </h2>
        <p className="text-gray-600">
          Przetwarzanie PDF w celu utworzenia interaktywnego doświadczenia nauki
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-3 rounded-lg border ${
              step.completed
                ? "bg-green-50 border-green-200"
                : step.loading
                ? "bg-blue-50 border-blue-200"
                : step.error
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {step.loading ? (
                <Loader className="w-5 h-5 text-blue-500 animate-spin" />
              ) : step.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.error ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <step.icon className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${
                step.completed
                  ? "text-green-800"
                  : step.loading
                  ? "text-blue-800"
                  : step.error
                  ? "text-red-800"
                  : "text-gray-700"
              }`}>
                {step.label}
              </h3>
              <p className={`text-sm ${
                step.completed
                  ? "text-green-600"
                  : step.loading
                  ? "text-blue-600"
                  : step.error
                  ? "text-red-600"
                  : "text-gray-500"
              }`}>
                {step.error || step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Postęp</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function PdfDetailClient({ pdfId }: PdfDetailClientProps) {
  const [pdf, setPdf] = useState<PdfDocument | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const initializeSteps = (): ProcessingStep[] => [
    {
      id: "process",
      label: "Przetwarzanie PDF",
      description: "Wyodrębnianie tekstu i analiza zawartości",
      icon: FileTextIcon,
      completed: false,
      loading: false,
    },
    {
      id: "chunks",
      label: "Generowanie fragmentów",
      description: "Dzielenie zawartości na mniejsze części",
      icon: Hash,
      completed: false,
      loading: false,
    },
    {
      id: "summaries",
      label: "Generowanie streszczeń",
      description: "Tworzenie streszczeń dla każdego fragmentu",
      icon: FileTextIcon,
      completed: false,
      loading: false,
    },
    {
      id: "global-summary",
      label: "Tworzenie przeglądu",
      description: "Generowanie ogólnego przeglądu dokumentu",
      icon: Brain,
      completed: false,
      loading: false,
    },
  ];

  const fetchPdfDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pdf-list/${pdfId}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || res.statusText);
      }
      const data: PdfDocument = await res.json();
      setPdf(data);

      const { data: urlData } = supabaseAnonKey.storage
        .from("pdfs")
        .getPublicUrl(data.path);
        
        setPublicUrl(urlData.publicUrl);
      
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Nieznany błąd";
      console.error(e);
      setError(errorMessage || "Nie udało się załadować PDF.");
    } finally {
      setLoading(false);
    }
  }, [pdfId]);

  useEffect(() => {
    if (!pdfId) {
      setError("Nie podano ID PDF.");
      setLoading(false);
    } else {
      fetchPdfDetail();
    }
  }, [pdfId, fetchPdfDetail]);

  const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const markStepCompleted = (stepId: string) => {
    updateStep(stepId, { completed: true, loading: false });
    setCurrentStep(prev => prev + 1);
  };

  const markStepLoading = (stepId: string) => {
    updateStep(stepId, { loading: true, error: undefined });
  };

  const markStepError = (stepId: string, error: string) => {
    updateStep(stepId, { loading: false, error });
  };

  const processStep = async (stepId: string, apiCall: () => Promise<void>): Promise<boolean> => {
    try {
      markStepLoading(stepId);
      await apiCall();
      markStepCompleted(stepId);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Krok nie powiódł się";
      markStepError(stepId, errorMessage);
      return false;
    }
  };

  const handleCreateELearning = async () => {
    if (!pdf) return;

    setIsProcessing(true);
    setSteps(initializeSteps());
    setCurrentStep(0);

    try {
      // Krok 1: Przetwarzanie PDF (jeśli nie zostało jeszcze przetworzone)
      if (!pdf.processed) {
        const success = await processStep("process", async () => {
          const res = await fetch('/api/pdf-page-slice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Przetwarzanie nie powiodło się');
          
          // Aktualizacja stanu PDF
          setPdf(prev => prev ? { ...prev, processed: true } : null);
        });
        if (!success) return;
      } else {
        markStepCompleted("process");
      }

      // Krok 2: Generowanie fragmentów (zawsze wykonywany)
      const success2 = await processStep("chunks", async () => {
        const res = await fetch('/api/generate-chunks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Generowanie fragmentów nie powiodło się');
      });
      if (!success2) return;

      // Krok 3: Generowanie streszczeń (jeśli nie zostały jeszcze wygenerowane)
      if (!pdf.generated_summaries) {
        const success3 = await processStep("summaries", async () => {
          const res = await fetch('/api/generate-summaries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Generowanie streszczeń nie powiodło się');
          
          // Aktualizacja stanu PDF
          setPdf(prev => prev ? { ...prev, generated_summaries: true } : null);
        });
        if (!success3) return;
      } else {
        markStepCompleted("summaries");
      }

      // Krok 4: Generowanie globalnego streszczenia (jeśli nie zostało jeszcze wygenerowane)
      if (!pdf.summary) {
        const success4 = await processStep("global-summary", async () => {
          const res = await fetch('/api/generate-global-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Generowanie globalnego streszczenia nie powiodło się');
          
          // Aktualizacja stanu PDF
          setPdf(prev => prev ? { ...prev, summary: json.summary } : null);
        });
        if (!success4) return;
      } else {
        markStepCompleted("global-summary");
      }

      // Wszystkie kroki zakończone, przekierowanie na stronę nauki
      toast.success("Kurs e-learningowy jest gotowy!");
      setTimeout(() => {
        router.push(`/learn/${pdfId}`);
      }, 1000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Nieznany błąd";
      console.error("Błąd tworzenia e-learningu:", error);
      toast.error(errorMessage || "Nie udało się utworzyć kursu e-learningowego");
    } finally {
      setIsProcessing(false);
    }
  };

  // Sprawdzenie czy całe przetwarzanie jest zakończone
  const isELearningReady = pdf?.processed && pdf?.generated_summaries && pdf?.summary;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <LoaderCircle size={48} className="mb-4 animate-spin text-indigo-500" />
        <h1 className="text-2xl font-semibold">Ładowanie szczegółów PDF...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-red-600 p-8">
        <AlertTriangle size={48} className="mb-4 text-red-600" />
        <h1 className="text-2xl font-semibold mb-2">Błąd</h1>
        <p className="text-center">{error}</p>
        <Link
          href="/pdf"
          className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Powrót do listy
        </Link>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <Info size={48} className="mb-4 text-slate-500" />
        <h1 className="text-2xl font-semibold">PDF nie znaleziony</h1>
        <Link
          href="/pdf"
          className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Powrót do listy
        </Link>
      </div>
    );
  }

  const title = pdf.title || pdf.filename;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 text-slate-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <header className="mb-8">
            <Link
              href="/pdf"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-4 group"
            >
              <ArrowLeft
                size={18}
                className="mr-1 transition-transform group-hover:-translate-x-1"
              />
              Powrót do listy PDF
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-10 h-10 text-indigo-500" />
              <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            </div>
            {pdf.title && pdf.filename !== pdf.title && (
              <p className="text-sm text-slate-500">
                Oryginalna nazwa pliku: {pdf.filename}
              </p>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DetailItem icon={User} label="Autor" value={pdf.author} />
            <DetailItem icon={Tag} label="Temat" value={pdf.subject} />
            <DetailItem
              icon={CalendarDays}
              label="Data przesłania"
              value={new Date(pdf.uploaded_at).toLocaleString("pl-PL")}
            />
            <DetailItem
              icon={CheckCircle}
              label="Przetworzony"
              isBoolean
              booleanValue={pdf.processed}
            />
            <DetailItem
              icon={BookOpen}
              label="Strony"
              value={formatNumber(pdf.page_count)}
            />
            <DetailItem
              icon={Type}
              label="Słowa"
              value={formatNumber(pdf.word_count)}
            />
            <DetailItem
              icon={Hash}
              label="Znaki"
              value={formatNumber(pdf.char_count)}
            />
            <DetailItem
              icon={CheckCircle}
              label="Wygenerowane streszczenia"
              isBoolean
              booleanValue={!!pdf.generated_summaries}
            />
          </div>

          <div className="flex gap-4 mb-8">
            {publicUrl && (
              <motion.a
                href={publicUrl}
                download={pdf.filename}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} className="mr-2" />
                Pobierz PDF
              </motion.a>
            )}

            {isELearningReady ? (
              <motion.button
                onClick={() => router.push(`/learn/${pdfId}`)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={20} className="mr-2" />
                Przejdź do e-learningu
              </motion.button>
            ) : (
              <motion.button
                onClick={handleCreateELearning}
                disabled={isProcessing}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <Loader size={20} className="mr-2 animate-spin" />
                    Tworzenie kursu...
                  </>
                ) : (
                  <>
                    <Zap size={20} className="mr-2" />
                    Utwórz kurs e-learningowy
                  </>
                )}
              </motion.button>
            )}
          </div>

          {pdf.summary && <SummarySection summary={pdf.summary} />}
        </motion.div>
      </div>

      {/* Modal przetwarzania */}
      <AnimatePresence>
        {isProcessing && (
          <ProcessingSteps 
            steps={steps} 
            currentStep={currentStep}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </>
  );
}
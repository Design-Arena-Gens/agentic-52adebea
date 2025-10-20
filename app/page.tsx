'use client';

import { useState } from 'react';
import { Search, TrendingUp, Package, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface TrendData {
  productType: string;
  searchVolume: number;
  competition: number;
  buyingIntent: number;
  keywords: string[];
  averagePrice: number;
  salesVelocity: number;
}

interface GeneratedProduct {
  id: string;
  type: string;
  title: string;
  description: string;
  keywords: string[];
  format: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [generatedProduct, setGeneratedProduct] = useState<GeneratedProduct | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const scanMarkets = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setTrendData([]);
    setLogs([]);
    addLog('Initiating market scan...');

    try {
      setScanProgress(20);
      addLog('Scraping Amazon marketplace data...');

      const response = await fetch('/api/scan-markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: ['amazon', 'etsy'] })
      });

      setScanProgress(60);
      addLog('Analyzing competition metrics...');

      const data = await response.json();

      setScanProgress(80);
      addLog('Calculating buying intent scores...');

      if (data.trends) {
        setTrendData(data.trends);
        addLog(`Found ${data.trends.length} high-potential opportunities`);
      }

      setScanProgress(100);
      addLog('Market scan complete!');
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScanning(false);
    }
  };

  const generateProduct = async (trend: TrendData) => {
    setIsGenerating(true);
    setGenerateProgress(0);
    setSelectedTrend(trend);
    setGeneratedProduct(null);
    addLog(`Starting product generation for: ${trend.productType}`);

    try {
      setGenerateProgress(15);
      addLog('Generating AI-powered content...');

      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend })
      });

      setGenerateProgress(40);
      addLog('Creating professional design layout...');

      const data = await response.json();

      setGenerateProgress(70);
      addLog('Applying color palette and typography...');

      if (data.product) {
        setGenerateProgress(90);
        addLog('Running quality assurance checks...');

        setGeneratedProduct(data.product);
        addLog('Product generation complete!');
      }

      setGenerateProgress(100);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProduct = async () => {
    if (!generatedProduct) return;

    addLog('Preparing download...');

    try {
      const response = await fetch(`/api/download-product?id=${generatedProduct.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedProduct.title.replace(/\s+/g, '-')}.${generatedProduct.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addLog('Download started successfully!');
    } catch (error) {
      addLog(`Download error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Digital Product Research Agent
          </h1>
          <p className="text-xl text-gray-300">
            Autonomous trend analysis and digital product creation powered by AI
          </p>
        </header>

        {/* Main Action */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/20">
            <button
              onClick={scanMarkets}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Scanning Markets... {scanProgress}%
                </>
              ) : (
                <>
                  <Search size={24} />
                  Scan Markets for Opportunities
                </>
              )}
            </button>

            {isScanning && (
              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trends Grid */}
        {trendData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="text-green-400" />
              High-Potential Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendData.map((trend, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                  onClick={() => generateProduct(trend)}
                >
                  <h3 className="text-xl font-bold mb-4 text-purple-300">{trend.productType}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Search Volume:</span>
                      <span className="font-bold text-green-400">{trend.searchVolume.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Competition:</span>
                      <span className={`font-bold ${trend.competition < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {trend.competition}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Buying Intent:</span>
                      <span className="font-bold text-purple-400">{trend.buyingIntent}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg. Price:</span>
                      <span className="font-bold text-blue-400">${trend.averagePrice}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Top Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                      {trend.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="bg-purple-600/30 px-3 py-1 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateProduct(trend);
                    }}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Package size={18} />
                    Generate Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Loader2 className="animate-spin text-purple-400" />
                Generating Product... {generateProgress}%
              </h3>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${generateProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Generated Product */}
        {generatedProduct && (
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-green-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-green-400" size={32} />
                <h2 className="text-3xl font-bold text-green-400">Product Generated Successfully!</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  {generatedProduct.thumbnailUrl && (
                    <img
                      src={generatedProduct.thumbnailUrl}
                      alt={generatedProduct.title}
                      className="w-full rounded-lg shadow-lg mb-4"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{generatedProduct.title}</h3>
                    <p className="text-gray-300">{generatedProduct.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Type:</p>
                    <span className="bg-purple-600/30 px-4 py-2 rounded-lg inline-block">
                      {generatedProduct.type}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Format:</p>
                    <span className="bg-blue-600/30 px-4 py-2 rounded-lg inline-block uppercase">
                      {generatedProduct.format}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedProduct.keywords.map((keyword, i) => (
                        <span key={i} className="bg-slate-700 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={downloadProduct}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                  >
                    <Download size={20} />
                    Download Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        {logs.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-400" size={20} />
                Activity Log
              </h3>
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

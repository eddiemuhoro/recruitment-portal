import { useEffect, useState } from 'react';
import type { JobApplication } from '../../types';

interface DocumentStats {
  totalDocuments: number;
  documentsByType: Record<string, number>;
  averageDocumentsPerApplication: number;
  incompleteApplications: number;
  mostCommonDocumentTypes: Array<{ type: string; count: number; percentage: number }>;
}

interface DocumentAnalyticsProps {
  applications: JobApplication[];
}

export default function DocumentAnalytics({ applications }: DocumentAnalyticsProps) {
  const [stats, setStats] = useState<DocumentStats | null>(null);

  useEffect(() => {
    const calculateStats = () => {
      const documentsByType: Record<string, number> = {};
      let totalDocuments = 0;
      let incompleteApplications = 0;

      applications.forEach(app => {
        const docCount = app.documents?.length || 0;
        totalDocuments += docCount;
        
        if (docCount === 0) {
          incompleteApplications++;
        }

        app.documents?.forEach(doc => {
          documentsByType[doc.document_type] = (documentsByType[doc.document_type] || 0) + 1;
        });
      });

      const mostCommonDocumentTypes = Object.entries(documentsByType)
        .map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalDocuments) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalDocuments,
        documentsByType,
        averageDocumentsPerApplication: applications.length > 0 ? Math.round((totalDocuments / applications.length) * 100) / 100 : 0,
        incompleteApplications,
        mostCommonDocumentTypes
      });
    };

    calculateStats();
  }, [applications]);

  if (!stats) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Document Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</div>
          <div className="text-sm text-blue-800">Total Documents</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.averageDocumentsPerApplication}</div>
          <div className="text-sm text-green-800">Avg per Application</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.incompleteApplications}</div>
          <div className="text-sm text-yellow-800">Incomplete Apps</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.documentsByType).length}</div>
          <div className="text-sm text-purple-800">Document Types</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Most Common Document Types</h4>
        <div className="space-y-2">
          {stats.mostCommonDocumentTypes.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">
                  {item.type.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-500">
                  {item.count} documents
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 w-8">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

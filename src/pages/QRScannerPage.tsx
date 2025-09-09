import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import QRScanner from '../components/qr/QRScanner';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApiQuery } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants/api';

interface AttendanceHistory {
  id: string;
  sessionTitle: string;
  courseName: string;
  markedAt: string;
  status: 'PRESENT' | 'LATE';
}

const QRScannerPage: React.FC = () => {
  const [scannedSessionId, setScannedSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: recentAttendance = [] } = useApiQuery<AttendanceHistory[]>(
    ['recent-attendance'],
    '/attendance/recent'
  );

  const handleScanSuccess = (sessionId: string) => {
    setScannedSessionId(sessionId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          QR Code Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Scan QR codes to mark your attendance for offline sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Scanner */}
        <div>
          <QRScanner onScanSuccess={handleScanSuccess} />
        </div>

        {/* Recent Attendance & Info */}
        <div className="space-y-6">
          {/* Scan Success Message */}
          {scannedSessionId && (
            <Card className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Attendance Marked Successfully!
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your attendance has been recorded for this session.
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/attendance')}
                >
                  View My Attendance
                </Button>
              </div>
            </Card>
          )}

          {/* Recent Attendance History */}
          <Card>
            <CardHeader title="Recent Attendance" />
            
            <div className="space-y-3">
              {recentAttendance.slice(0, 5).map((record) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {record.sessionTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {record.courseName}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock size={12} className="mr-1" />
                      {new Date(record.markedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={record.status === 'PRESENT' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
              
              {recentAttendance.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No recent attendance records found
                </p>
              )}
            </div>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader title="How to Use QR Scanner" />
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Check Session Schedule
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Make sure you're attending the correct session at the right time
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Be in the Right Location
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ensure you're physically present at the class location
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Scan the QR Code
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ask your instructor to display the QR code and scan it
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;
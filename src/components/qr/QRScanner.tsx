import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle, CheckCircle } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useApiMutation } from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../constants/api';

interface QRScannerProps {
  onScanSuccess: (sessionId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastScanResult, setLastScanResult] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  const markAttendanceMutation = useApiMutation(
    'POST',
    API_ENDPOINTS.ATTENDANCE.MARK_QR,
    {
      successMessage: 'Attendance marked successfully!',
      onSuccess: () => {
        setSuccess('Attendance marked successfully!');
        setTimeout(() => setSuccess(null), 3000);
      },
      onError: () => {
        setError('Failed to mark attendance');
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setSuccess(null);

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrcodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Handle scan failure silently - this fires constantly while scanning
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('QR Scanner Error:', err);
      setError('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
        html5QrcodeRef.current = null;
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Prevent duplicate scans
    if (decodedText === lastScanResult) {
      return;
    }

    setLastScanResult(decodedText);

    try {
      // Extract session ID from QR code data
      const qrData = JSON.parse(decodedText);
      const { sessionId, location } = qrData;

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // Mark attendance
            await markAttendanceMutation.mutateAsync({
              sessionId,
              location: userLocation,
              qrData: decodedText,
            });

            onScanSuccess(sessionId);
            
            // Stop scanning after successful scan
            stopScanning();
          },
          (geoError) => {
            console.error('Geolocation error:', geoError);
            setError('Location access required for attendance marking');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      } else {
        setError('Geolocation not supported by this browser');
      }
    } catch (err) {
      console.error('QR parsing error:', err);
      setError('Invalid QR code format');
    }

    // Reset last scan result after 2 seconds
    setTimeout(() => setLastScanResult(null), 2000);
  };

  return (
    <Card>
      <CardHeader 
        title="QR Code Scanner" 
        subtitle="Scan the QR code to mark your attendance"
      />

      <div className="space-y-6">
        {/* Scanner Container */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              id="qr-reader" 
              className={`${isScanning ? '' : 'hidden'} rounded-lg overflow-hidden border-4 border-blue-500`}
              style={{ width: '300px', height: '300px' }}
            />
            
            {!isScanning && (
              <div className="w-80 h-80 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Start Scanner" to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-600 dark:text-green-400">{success}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              variant="primary"
              leftIcon={<Camera size={20} />}
            >
              Start Scanner
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="secondary"
              leftIcon={<CameraOff size={20} />}
            >
              Stop Scanner
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Instructions:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Allow camera access when prompted</li>
            <li>• Position the QR code within the scanning area</li>
            <li>• Ensure you're within the required location range</li>
            <li>• Hold steady until the code is detected</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default QRScanner;
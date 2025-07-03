import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';

const MOCK_DATABASE = {
  'ABC123': { name: 'Kim Jiho', ticket: 'VIP', entered: false },
  'XYZ789': { name: 'Park Hana', ticket: 'General', entered: false },
};

function App() {
  const [barcode, setBarcode] = useState('');
  const [attendee, setAttendee] = useState(null);
  const [status, setStatus] = useState('');
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef(null);

  const checkEntry = (code) => {
    const info = MOCK_DATABASE[code];
    setBarcode(code);

    if (!info) {
      setAttendee(null);
      setStatus('❌ 등록되지 않은 바코드입니다.');
      return;
    }

    if (info.entered) {
      setStatus('⚠️ 이미 입장하였습니다.');
    } else {
      info.entered = true;
      setStatus('✅ 입장 완료!');
    }

    setAttendee({ ...info });
    setScanned(true);
  };

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          checkEntry(decodedText);
        },
        (error) => {
          // 생략 가능: 오류 로그
        }
      );

      scannerRef.current = scanner;
    }
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">입장 확인 시스템</h1>

      {/* ✅ QR 스캐너 */}
      <div id="reader" className="w-full max-w-md mx-auto border rounded" />

      {/* ✅ 스캔 결과 */}
      {scanned && (
        <div className="mt-4 border p-4 rounded bg-gray-100 shadow">
          <p className="text-lg font-bold">📦 스캔 결과</p>
          <p>🔹 바코드: {barcode}</p>
          {attendee ? (
            <>
              <p>👤 이름: {attendee.name}</p>
              <p>🎟️ 티켓: {attendee.ticket}</p>
              <p>🚪 입장 여부: {attendee.entered ? '입장 완료' : '미입장'}</p>
              <p className="text-green-600 font-semibold mt-2">{status}</p>
            </>
          ) : (
            <p className="text-red-600 font-semibold">{status}</p>
          )}
        </div>
      )}

      {/* ✅ 예시용 QR 생성 */}
      <div className="mt-8 text-center">
        <p className="font-semibold">🎫 예시 QR 코드</p>
        <QRCodeCanvas value="ABC123" size={128} />
        <p className="text-sm mt-1 text-gray-500">이 코드를 스캔해보세요</p>
      </div>
    </div>
  );
}

export default App;

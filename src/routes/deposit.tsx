import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Sun, Moon, Copy, Send, Smartphone, CreditCard, Shield } from 'lucide-react';
import { useTheme } from '@/utility/ThemeProvider';

const ManualDeposit = () => {
    const { isDark } = useTheme();
  
  const [transactionId, setTransactionId] = useState('');
  
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ payment_id: transactionId });
    // Here you would typically forward to backend
    setTransactionId('');
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-yellow-50 text-yellow-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">M-Pesa Deposit</h1>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Instructions Panel */}
          <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Smartphone className="text-yellow-500" />
              Manual Deposit Instructions
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                <h3 className="font-medium mb-2">1. Copy Paybill Number</h3>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg">790000</span>
                  <button 
                    onClick={() => copyToClipboard('790000')}
                    className={`p-2 rounded ${isDark ? 'hover:bg-gray-600' : 'hover:bg-yellow-200'}`}
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                <h3 className="font-medium mb-2">2. Send via M-Pesa</h3>
                <p>Go to M-Pesa on your phone, select "Paybill", enter the business number <strong>790000</strong>, and complete the payment.</p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                <h3 className="font-medium mb-2">3. Enter Transaction ID</h3>
                <p>After payment, you'll receive a confirmation message with a transaction code. Enter it below for verification.</p>
              </div>
            </div>
            
            <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-100 text-blue-800'}`}>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="text-blue-500" />
                Coming Soon: Automatic Payments
              </h3>
              <p className="text-sm">In the future, we'll be implementing automatic M-Pesa API integration for instant verification.</p>
            </div>
          </div>
          
          {/* Transaction Form */}
          <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="text-yellow-500" />
              Verify Your Payment
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium mb-2">
                  M-Pesa Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 focus:ring-yellow-500 focus:border-yellow-500' 
                      : 'bg-yellow-50 border-yellow-200 focus:ring-yellow-500 focus:border-yellow-500'
                  }`}
                  placeholder="e.g. RLX7O2E0W9"
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
                    : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
                } transition-colors`}
              >
                <Send size={18} />
                Submit for Verification
              </button>
            </form>
            
            <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Our admin team will verify your transaction</li>
                <li>This process may take up to 15 minutes</li>
                <li>You'll receive a confirmation once verified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export const Route = createFileRoute('/deposit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManualDeposit />
}


import React from 'react';
import { Shield } from 'lucide-react';

const RazorpayCard: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
      <div className="flex items-start space-x-3">
        <div className="bg-blue-50 p-2 rounded">
          <img 
            src="https://razorpay.com/assets/razorpay-logo.svg" 
            alt="Razorpay" 
            className="h-8 w-auto" 
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCA4MCAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjc2NiA3LjM2NkgyMS43MzJMMTguOTA0IDE2SDIxLjQ2N0wyNC4yOTYgNy4zNjZIMjMuNzY2WiIgZmlsbD0iIzM3OTVFRCIvPgo8cGF0aCBkPSJNMTMuNjc1IDE1LjI1NEwxMy4wOTUgMTMuMDMxSDEwLjAzNkwxMC4wODQgMTJIMTMuNTM3TDE0LjExNyAxNEgxNi45NDdMMTMuNjc1IDE1LjI1NFoiIGZpbGw9IiMzNzk1RUQiLz4KPHBhdGggZD0iTTguNjAyIDEwLjE5NEw5LjE3MiAxMi4wODNIMTIuOTAzTDExLjQzNyA2SDcuMTY4TDQuMDQ5IDE2SDguNzM5TDkuODU2IDExLjkyN0w4LjYwMiAxMC4xOTRaIiBmaWxsPSIjM0M0MDQ2Ii8+CjxwYXRoIGQ9Ik0zNC42NTkgOS42MTlDMzQuNjU5IDguNzg4IDM0LjE4NyA4LjI1OSAzMy4xODcgOC4yNTlDMzIuNTk4IDguMjU5IDMyLjA4NCA4LjQ4NyAzMS44MzUgOC44NDlIMzEuMjU4QzMxLjUzNSA4LjAwNCAzMi4zNTQgNy4xMyAzMy44NTQgNy4xM0MzNS40NDcgNy4xMyAzNi4yNjcgOC4wODkgMzYuMjY3IDkuMzc2QzM2LjI2NyAxMC40MzMgMzUuNzM5IDExLjI5MiAzNC45MDcgMTEuOTMybDEuNSAxLjgxOVYxNEgzMS44MzVWMTIuNzQ3SDMzLjcwMUwzMi45OTggMTEuOTMyQzMzLjk4NCAxMS4wNzIgMzQuNjU5IDEwLjUyOSAzNC42NTkgOS42MTlaIiBmaWxsPSIjM0M0MDQ2Ii8+CjxwYXRoIGQ9Ik00MC41MjcgMTEuNzYxSDM3LjU0NFY3LjM2Nkg0MC41MjdWOC40OTVIMzguOTUxVjkuMjI1SDQwLjM0NFYxMC4zNjhIMzguOTUxVjEwLjYzMkg0MC41MjdWMTEuNzYxWiIgZmlsbD0iIzNDNDA0NiIvPgo8cGF0aCBkPSJNNDYuNDMyIDExLjc2MUg0My40NDlWNy4zNjZINDYuNDMyVjguNDk1SDQ0Ljg1Nkg0NS40MDNWMTAuNDk2SDQ0Ljg1Nkg0Ni40MzJWMTEuNzYxWiIgZmlsbD0iIzNDNDA0NiIvPgo8cGF0aCBkPSJNNTIuMzM2IDExLjc2MUg0OS4zNTRWNy4zNjZINTIuMzM2VjguNDk1SDUwLjc2VjkuMjI1SDUyLjE1M1YxMC4zNjhINTAuNzZWMTAuNjMySDUyLjMzNlYxMS43NjFaIiBmaWxsPSIjM0M0MDQ2Ii8+CjxwYXRoIGQ9Ik01OC4yNDEgMTEuNzYxSDU1LjI1OVY3LjM2Nkg1OC4yNDFWOC40OTVINTYuNjY2VjkuMjI1SDU4LjA1OVYxMC4zNjhINTYuNjY2VjEwLjYzMkg1OC4yNDFWMTEuNzYxWiIgZmlsbD0iIzNDNDA0NiIvPgo8cGF0aCBkPSJNNjQuMTQ2IDExLjc2MUg2MS4xNjRWNy4zNjZINjQuMTQ2VjguNDk1SDYyLjU3MVY5LjIyNUg2My45NjRWMTAuMzY4SDYyLjU3MVYxMC42MzJINjQuMTQ2VjExLjc2MVoiIGZpbGw9IiMzQzQwNDYiLz4KPHBhdGggZD0iTTcwLjA1IDExLjc2MUg2Ny4wNjhWNy4zNjZINzAuMDVWOC40OTVINjguNDc1VjkuMjI1SDY5Ljg2OFYxMC4zNjhINjguNDc1VjEwLjYzMkg3MC4wNVYxMS43NjFaIiBmaWxsPSIjM0M0MDQ2Ii8+CjxwYXRoIGQ9Ik03NS45NTUgMTEuNzYxSDcyLjk3M1Y3LjM2Nkg3NS45NTVWOC40OTVINzQuMzc5VjkuMjI1SDc1Ljc3M1YxMC4zNjhINzQuMzc5VjEwLjYzMkg3NS45NTVWMTEuNzYxWiIgZmlsbD0iIzNDNDA0NiIvPgo8L3N2Zz4K';
            }}
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">Secure Online Payment</h4>
          <p className="text-sm text-gray-600 mt-1">
            Your payment is processed securely via Razorpay. We accept all major credit/debit cards, UPI, and net banking.
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <Shield className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-xs text-gray-500">PCI DSS Level 1 compliant payment processing</span>
      </div>
    </div>
  );
};

export default RazorpayCard;
